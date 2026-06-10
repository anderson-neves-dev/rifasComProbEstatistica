import { IsString, IsInt, IsDateString, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRaffleDto {
  @ApiProperty({ example: 'Rifa do Notebook' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Notebook Dell i5 8GB RAM', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100, description: 'Quantidade total de números disponíveis' })
  @IsInt()
  @Min(2)
  totalNumbers: number;

  @ApiProperty({ example: 10, description: 'Custo em pontos por ticket' })
  @IsInt()
  @Min(1)
  ticketCost: number;

  @ApiProperty({ example: 800, description: 'Prêmio em pontos para o vencedor' })
  @IsInt()
  @Min(1)
  prizeAmount: number;

  @ApiProperty({ example: '2025-12-31T23:59:00Z' })
  @IsDateString()
  drawDate: Date;
}
