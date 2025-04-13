/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotQueryDto, ChatbotResponseDto } from './dto';
import { JwtAuthGuard } from '@/auth/guard';
import { GetUser } from '@/auth/decorator';
import { User } from '@prisma/client';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('query')
  // @UseGuards(JwtAuthGuard)
  async processQuery(
    @Body() queryDto: ChatbotQueryDto,
    @GetUser() user: User,
  ): Promise<ChatbotResponseDto> {
    console.log(
      `[${new Date().toISOString()}] Chatbot query - User ID: ${user.id}, Email: ${user.email}, Query: "${queryDto.query}"`,
    );
    return this.chatbotService.processQuery(queryDto, user.id);
  }
}
