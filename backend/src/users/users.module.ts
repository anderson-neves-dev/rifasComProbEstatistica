import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Draw } from '../draws/draw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ticket, Draw])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
