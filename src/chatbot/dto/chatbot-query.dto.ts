import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatbotQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  query: string;
}

export class ChatbotResponseDto {
  response: string;
  isFinanceRelated: boolean;
}
