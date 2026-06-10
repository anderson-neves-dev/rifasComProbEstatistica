import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Raffle } from '../raffles/raffle.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  raffleId: string;

  @Column()
  userId: string;

  @Column()
  selectedNumber: number;

  @ManyToOne(() => Raffle, (raffle) => raffle.tickets)
  @JoinColumn({ name: 'raffleId' })
  raffle: Raffle;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
