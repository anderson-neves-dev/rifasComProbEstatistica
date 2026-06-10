import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Stats')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('global')
  @ApiOperation({ summary: 'Estatísticas globais de todos os sorteios (média, mediana, moda)' })
  getGlobalStats() {
    return this.statsService.getGlobalStats();
  }

  @Get('raffle/:raffleId')
  @ApiOperation({ summary: 'Estatísticas de uma rifa específica' })
  getRaffleStats(@Param('raffleId') raffleId: string) {
    return this.statsService.getRaffleStats(raffleId);
  }
}
