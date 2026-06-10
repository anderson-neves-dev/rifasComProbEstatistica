import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Draw } from '../draws/draw.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Raffle } from '../raffles/raffle.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Draw)
    private readonly drawRepository: Repository<Draw>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,
  ) {}

  /** Calcula a média de um array de números: soma / quantidade */
  private calculateMean(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
  }

  /** Calcula a mediana: valor central após ordenação do array */
  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const isEven = sorted.length % 2 === 0;
    return isEven
      ? parseFloat(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2))
      : sorted[mid];
  }

  /** Calcula a moda: valor(es) que aparecem com maior frequência */
  private calculateMode(numbers: number[]): number[] {
    if (numbers.length === 0) return [];

    const frequencyMap: Record<number, number> = {};
    numbers.forEach((n) => { frequencyMap[n] = (frequencyMap[n] ?? 0) + 1; });

    const maxFrequency = Math.max(...Object.values(frequencyMap));
    return Object.entries(frequencyMap)
      .filter(([, freq]) => freq === maxFrequency)
      .map(([num]) => Number(num));
  }

  /** Estatísticas globais de todos os sorteios já realizados */
  async getGlobalStats() {
    const draws = await this.drawRepository.find({ relations: ['raffle'] });
    const winningNumbers = draws.map((d) => d.winningNumber);

    const totalRaffles = await this.raffleRepository.count();
    const totalTickets = await this.ticketRepository.count();

    return {
      totalDraws: draws.length,
      totalRaffles,
      totalTickets,
      winningNumbers,
      mean: this.calculateMean(winningNumbers),
      median: this.calculateMedian(winningNumbers),
      mode: this.calculateMode(winningNumbers),
    };
  }

  /** Estatísticas específicas de uma rifa */
  async getRaffleStats(raffleId: string) {
    const tickets = await this.ticketRepository.find({ where: { raffleId } });
    const raffle = await this.raffleRepository.findOne({ where: { id: raffleId } });
    const draw = await this.drawRepository.findOne({ where: { raffleId }, relations: ['winner'] });

    const soldNumbers = tickets.map((t) => t.selectedNumber);
    const totalTicketsSold = tickets.length;

    return {
      raffle,
      draw,
      totalTicketsSold,
      availableNumbers: raffle.totalNumbers - totalTicketsSold,
      soldNumbers,
      mean: this.calculateMean(soldNumbers),
      median: this.calculateMedian(soldNumbers),
      mode: this.calculateMode(soldNumbers),
      // Frequência absoluta: quantas vezes cada número foi vendido (sempre 0 ou 1 nesta rifa)
      absoluteFrequency: soldNumbers.length,
      // Frequência relativa: proporção de números vendidos em relação ao total
      relativeFrequency: raffle
        ? parseFloat(((totalTicketsSold / raffle.totalNumbers) * 100).toFixed(2))
        : 0,
    };
  }
}
