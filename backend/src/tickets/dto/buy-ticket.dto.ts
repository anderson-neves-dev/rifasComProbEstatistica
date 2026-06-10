import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyTicketDto {
  @ApiProperty({ example: 'uuid-da-rifa' })
  @IsUUID()
  raffleId: string;

  @ApiProperty({ example: 42, description: 'Número escolhido (entre 1 e totalNumbers da rifa)' })
  @IsInt()
  @Min(1)
  selectedNumber: number;
}
