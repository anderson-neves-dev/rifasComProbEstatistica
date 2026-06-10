import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Raffles')
@Controller('raffles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as rifas com probabilidade do usuário' })
  findAll(@Request() req) {
    return this.rafflesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma rifa específica' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.rafflesService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova rifa' })
  create(@Body() dto: CreateRaffleDto, @Request() req) {
    return this.rafflesService.create(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar rifa (apenas criador, apenas OPEN)' })
  update(@Param('id') id: string, @Body() dto: UpdateRaffleDto, @Request() req) {
    return this.rafflesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar rifa (apenas criador, apenas OPEN)' })
  delete(@Param('id') id: string, @Request() req) {
    return this.rafflesService.delete(id, req.user.id);
  }
}
