import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';

export enum RaffleStatus {
  OPEN = 'OPEN',
  DRAWN = 'DRAWN',
  CANCELLED = 'CANCELLED',
}

@Entity('raffles')
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  totalNumbers: number;

  @Column()
  ticketCost: number;

  /** Prêmio em pontos que o vencedor recebe */
  @Column()
  prizeAmount: number;

  @Column({ type: 'timestamp' })
  drawDate: Date;

  @Column({ type: 'enum', enum: RaffleStatus, default: RaffleStatus.OPEN })
  status: RaffleStatus;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.raffles)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @OneToMany(() => Ticket, (ticket) => ticket.raffle)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;
}
