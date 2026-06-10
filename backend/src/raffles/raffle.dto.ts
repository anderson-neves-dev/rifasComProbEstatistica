import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateRaffleDto {
  @ApiProperty({ example: 'Rifa do Notebook' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Notebook i7 16GB RAM' })
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

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Data do sorteio (opcional)' })
  @IsDateString()
  @IsOptional()
  drawDate?: string;
}
