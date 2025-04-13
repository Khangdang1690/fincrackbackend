/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotQueryDto, ChatbotResponseDto } from './dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('query')
  async processQuery(
    @Body() queryDto: ChatbotQueryDto,
  ): Promise<ChatbotResponseDto> {
    console.log(
      `[${new Date().toISOString()}] Chatbot query - User - Query: "${queryDto.query}"
    `);
    // Use a default user ID for anonymous users
    return this.chatbotService.processQuery(queryDto, 'user');
  }
}