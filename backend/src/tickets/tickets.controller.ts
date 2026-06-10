import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Comprar um ticket (debita pontos do usuário)' })
  buyTicket(@Body() dto: BuyTicketDto, @Request() req) {
    return this.ticketsService.buyTicket(dto, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Listar meus tickets' })
  getMyTickets(@Request() req) {
    return this.ticketsService.getMyTickets(req.user.id);
  }

  @Get('raffle/:raffleId')
  @ApiOperation({ summary: 'Listar todos os tickets de uma rifa' })
  getTicketsByRaffle(@Param('raffleId') raffleId: string) {
    return this.ticketsService.getTicketsByRaffle(raffleId);
  }
}
