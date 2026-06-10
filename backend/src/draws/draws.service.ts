import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Draw } from './draw.entity';
import { Raffle, RaffleStatus } from '../raffles/raffle.entity';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DrawsService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Executa o sorteio de uma rifa.
   * Gera um número aleatório entre 1 e totalNumbers da rifa,
   * encontra o ticket correspondente (se houver) e credita o prêmio ao vencedor.
   */
  async executeDraw(raffleId: string, requesterId: string): Promise<Draw> {
    const raffle = await this.raffleRepository.findOne({ where: { id: raffleId } });
    if (!raffle) throw new NotFoundException('Rifa não encontrada');
    if (raffle.creatorId !== requesterId) throw new ForbiddenException('Apenas o criador pode executar o sorteio');
    if (raffle.status !== RaffleStatus.OPEN) throw new BadRequestException('Esta rifa já foi sorteada ou cancelada');

    // Gera número vencedor aleatório entre 1 e totalNumbers
    const winningNumber = Math.floor(Math.random() * raffle.totalNumbers) + 1;

    // Busca o ticket com o número vencedor
    const winnerTicket = await this.ticketRepository.findOne({
      where: { raffleId, selectedNumber: winningNumber },
    });

    const winnerId = winnerTicket?.userId ?? null;

    // Credita o prêmio ao vencedor se houver um ticket com o número sorteado
    if (winnerId) {
      const winner = await this.userRepository.findOne({ where: { id: winnerId } });
      await this.userRepository.update(winnerId, { points: winner.points + raffle.prizeAmount });
    }

    // Marca a rifa como sorteada
    await this.raffleRepository.update(raffleId, { status: RaffleStatus.DRAWN });

    const draw = this.drawRepository.create({ raffleId, winningNumber, winnerId });
    const savedDraw = await this.drawRepository.save(draw);

    return this.drawRepository.findOne({
      where: { id: savedDraw.id },
      relations: ['raffle', 'winner'],
    });
  }

  async getDrawByRaffle(raffleId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne({
      where: { raffleId },
      relations: ['raffle', 'winner'],
    });
    if (!draw) throw new NotFoundException('Sorteio não encontrado para esta rifa');
    return draw;
  }

  async getAllDraws(): Promise<Draw[]> {
    return this.drawRepository.find({
      relations: ['raffle', 'winner'],
      order: { drawDate: 'DESC' },
    });
  }
}
