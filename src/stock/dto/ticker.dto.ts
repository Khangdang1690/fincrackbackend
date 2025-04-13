import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class TickerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9.-]+$/, {
    message: 'Ticker symbol can only contain uppercase letters, numbers, dots, and hyphens.'
  })
  ticker: string;
} 