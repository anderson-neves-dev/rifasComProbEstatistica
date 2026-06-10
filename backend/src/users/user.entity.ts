import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Raffle } from '../raffles/raffle.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 100 })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Raffle, (raffle) => raffle.creator)
  raffles: Raffle[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
