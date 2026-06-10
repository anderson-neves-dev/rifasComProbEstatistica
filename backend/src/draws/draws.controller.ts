import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DrawsService } from './draws.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Draws')
@Controller('draws')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DrawsController {
  constructor(private readonly drawsService: DrawsService) {}

  @Post('raffle/:raffleId')
  @ApiOperation({ summary: 'Executar sorteio (apenas criador da rifa)' })
  executeDraw(@Param('raffleId') raffleId: string, @Request() req) {
    return this.drawsService.executeDraw(raffleId, req.user.id);
  }

  @Get('raffle/:raffleId')
  @ApiOperation({ summary: 'Resultado do sorteio de uma rifa' })
  getDrawByRaffle(@Param('raffleId') raffleId: string) {
    return this.drawsService.getDrawByRaffle(raffleId);
  }

  @Get()
  @ApiOperation({ summary: 'Histórico de todos os sorteios' })
  getAllDraws() {
    return this.drawsService.getAllDraws();
  }
}
