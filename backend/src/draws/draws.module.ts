import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawsController } from './draws.controller';
import { DrawsService } from './draws.service';
import { Draw } from './draw.entity';
import { Raffle } from '../raffles/raffle.entity';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Draw, Raffle, Ticket, User])],
  controllers: [DrawsController],
  providers: [DrawsService],
  exports: [DrawsService],
})
export class DrawsModule {}
