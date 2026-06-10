import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Raffle } from '../raffles/raffle.entity';
import { User } from '../users/user.entity';

@Entity('draws')
export class Draw {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  raffleId: string;

  @Column()
  winningNumber: number;

  @Column({ nullable: true })
  winnerId: string;

  @CreateDateColumn()
  drawDate: Date;

  @ManyToOne(() => Raffle)
  @JoinColumn({ name: 'raffleId' })
  raffle: Raffle;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'winnerId' })
  winner: User;
}
