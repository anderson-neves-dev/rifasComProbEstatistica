import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Raffle, RaffleStatus } from '../raffles/raffle.entity';
import { User } from '../users/user.entity';
import { BuyTicketDto } from './dto/buy-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async buyTicket(dto: BuyTicketDto, userId: string): Promise<Ticket> {
    const raffle = await this.raffleRepository.findOne({ where: { id: dto.raffleId } });
    if (!raffle) throw new NotFoundException('Rifa não encontrada');
    if (raffle.status !== RaffleStatus.OPEN) throw new BadRequestException('Esta rifa não está mais aberta');

    // Valida se o número escolhido está dentro do range permitido
    if (dto.selectedNumber < 1 || dto.selectedNumber > raffle.totalNumbers) {
      throw new BadRequestException(`Número deve ser entre 1 e ${raffle.totalNumbers}`);
    }

    // Valida se o número já foi comprado
    const numberTaken = await this.ticketRepository.findOne({
      where: { raffleId: dto.raffleId, selectedNumber: dto.selectedNumber },
    });
    if (numberTaken) throw new ConflictException('Este número já foi comprado');

    // Valida se o usuário tem pontos suficientes
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user.points < raffle.ticketCost) {
      throw new BadRequestException(`Pontos insuficientes. Você tem ${user.points} pontos e o ticket custa ${raffle.ticketCost}`);
    }

    // Debita os pontos do usuário
    await this.userRepository.update(userId, { points: user.points - raffle.ticketCost });

    const ticket = this.ticketRepository.create({
      raffleId: dto.raffleId,
      userId,
      selectedNumber: dto.selectedNumber,
    });

    return this.ticketRepository.save(ticket);
  }

  async getMyTickets(userId: string) {
    return this.ticketRepository.find({
      where: { userId },
      relations: ['raffle'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTicketsByRaffle(raffleId: string) {
    return this.ticketRepository.find({
      where: { raffleId },
      relations: ['user'],
      order: { selectedNumber: 'ASC' },
    });
  }
}
