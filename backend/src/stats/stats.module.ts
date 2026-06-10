import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Draw } from '../draws/draw.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Raffle } from '../raffles/raffle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Draw, Ticket, Raffle])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
