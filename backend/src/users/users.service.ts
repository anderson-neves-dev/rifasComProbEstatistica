import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Draw } from '../draws/draw.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);

    const totalTickets = await this.ticketRepository.count({ where: { userId } });
    const totalWins = await this.drawRepository.count({ where: { winnerId: userId } });

    // Taxa de sucesso: vitórias / participações (em rifas distintas)
    const participatedRaffles = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('COUNT(DISTINCT ticket.raffleId)', 'count')
      .where('ticket.userId = :userId', { userId })
      .getRawOne();

    const totalParticipations = parseInt(participatedRaffles?.count ?? '0');
    const successRate = totalParticipations > 0
      ? parseFloat(((totalWins / totalParticipations) * 100).toFixed(2))
      : 0;

    return { ...user, totalTickets, totalWins, totalParticipations, successRate };
  }

  async getRanking() {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'points', 'createdAt'],
    });

    const rankingWithStats = await Promise.all(
      users.map(async (user) => {
        const totalWins = await this.drawRepository.count({ where: { winnerId: user.id } });

        const participatedRaffles = await this.ticketRepository
          .createQueryBuilder('ticket')
          .select('COUNT(DISTINCT ticket.raffleId)', 'count')
          .where('ticket.userId = :userId', { userId: user.id })
          .getRawOne();

        const totalParticipations = parseInt(participatedRaffles?.count ?? '0');
        const successRate = totalParticipations > 0
          ? parseFloat(((totalWins / totalParticipations) * 100).toFixed(2))
          : 0;

        return { ...user, totalWins, totalParticipations, successRate };
      }),
    );

    return rankingWithStats.sort((a, b) => b.totalWins - a.totalWins);
  }
}
