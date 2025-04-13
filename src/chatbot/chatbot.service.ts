/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatbotQueryDto, ChatbotResponseDto } from './dto';
import OpenAI from 'openai';
import { isFinanceRelatedByKeywords } from './utils/finance-validator';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: this.configService.get('NEBIUS_API_BASE_URL'),
      apiKey: this.configService.get('NEBIUS_API_KEY'),
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async processQuery(
    queryDto: ChatbotQueryDto,
    userId: string,
  ): Promise<ChatbotResponseDto> {
    try {
      // First, do a simple keyword check as a quick filter
      const isFinanceRelatedByKeyword = isFinanceRelatedByKeywords(
        queryDto.query,
      );

      if (!isFinanceRelatedByKeyword) {
        return {
          response:
            "I'm specialized in financial topics only. I can help with questions about banking, investments, loans, budgeting, and other finance-related topics. Please ask a finance-related question.",
          isFinanceRelated: false,
        };
      }

      // For debugging - log the configuration
      this.logger.log(
        `Using API base URL: ${this.configService.get('NEBIUS_API_BASE_URL')}`,
      );
      this.logger.log(
        `Using model ID: ${this.configService.get('NEBIUS_MODEL_ID') || 'deepseek-ai/DeepSeek-V3-0324-fast'}`,
      );

      try {
        const response = await this.openai.chat.completions.create({
          model:
            this.configService.get('NEBIUS_MODEL_ID') ||
            'deepseek-ai/DeepSeek-V3-0324-fast',
          messages: [
            {
              role: 'system',
              content: `You are a financial advisor specialized in banking, investments, and personal finance. 
              You must ONLY answer questions related to finance. For non-finance topics, politely decline to answer.`,
            },
            {
              role: 'user',
              content: queryDto.query,
            },
          ],
        });

        return {
          response: this.getResponseContent(response),
          isFinanceRelated: true,
        };
      } catch (apiError) {
        this.logger.error(`API Error: ${JSON.stringify(apiError)}`);
        return {
          response:
            "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again later.",
          isFinanceRelated: true,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error processing chatbot query: ${error.message}`,
        error.stack,
      );
      return {
        response:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        isFinanceRelated: true,
      };
    }
  }

  private getResponseContent(
    response: OpenAI.Chat.Completions.ChatCompletion,
  ): string {
    const content = response.choices[0].message.content;
    return (
      content ||
      "I apologize, but I couldn't generate a proper response. Please try rephrasing your question."
    );
  }
}
