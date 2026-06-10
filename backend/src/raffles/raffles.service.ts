import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Raffle, RaffleStatus } from './raffle.entity';
import { Ticket } from '../tickets/ticket.entity';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';

@Injectable()
export class RafflesService {
  constructor(
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(dto: CreateRaffleDto, creatorId: string): Promise<Raffle> {
    const raffle = this.raffleRepository.create({ ...dto, creatorId, status: RaffleStatus.OPEN });
    return this.raffleRepository.save(raffle);
  }

  async findAll(userId: string) {
    const raffles = await this.raffleRepository.find({
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
    return Promise.all(raffles.map((raffle) => this.buildRaffleResponse(raffle, userId)));
  }

  async findOne(id: string, userId: string) {
    const raffle = await this.raffleRepository.findOne({ where: { id }, relations: ['creator'] });
    if (!raffle) throw new NotFoundException('Rifa não encontrada');
    return this.buildRaffleResponse(raffle, userId);
  }

  async update(id: string, dto: UpdateRaffleDto, userId: string): Promise<Raffle> {
    const raffle = await this.raffleRepository.findOne({ where: { id } });
    if (!raffle) throw new NotFoundException('Rifa não encontrada');
    if (raffle.creatorId !== userId) throw new ForbiddenException('Apenas o criador pode editar a rifa');
    if (raffle.status !== RaffleStatus.OPEN) throw new BadRequestException('Não é possível editar rifa já sorteada');

    await this.raffleRepository.update(id, dto);
    return this.raffleRepository.findOne({ where: { id }, relations: ['creator'] });
  }

  async delete(id: string, userId: string): Promise<void> {
    const raffle = await this.raffleRepository.findOne({ where: { id } });
    if (!raffle) throw new NotFoundException('Rifa não encontrada');
    if (raffle.creatorId !== userId) throw new ForbiddenException('Apenas o criador pode deletar a rifa');
    if (raffle.status !== RaffleStatus.OPEN) throw new BadRequestException('Não é possível deletar uma rifa já sorteada');
    await this.raffleRepository.remove(raffle);
  }

  private async buildRaffleResponse(raffle: Raffle, userId: string) {
    const totalTicketsSold = await this.ticketRepository.count({ where: { raffleId: raffle.id } });
    const userTickets = await this.ticketRepository.count({ where: { raffleId: raffle.id, userId } });

    const winProbability = totalTicketsSold > 0
      ? parseFloat(((userTickets / totalTicketsSold) * 100).toFixed(2))
      : 0;

    const expectedValue = totalTicketsSold > 0
      ? parseFloat((raffle.prizeAmount * (userTickets / totalTicketsSold) - raffle.ticketCost).toFixed(2))
      : -raffle.ticketCost;

    return {
      ...raffle,
      totalTicketsSold,
      userTickets,
      winProbability,
      expectedValue,
      availableNumbers: raffle.totalNumbers - totalTicketsSold,
    };
  }
}
