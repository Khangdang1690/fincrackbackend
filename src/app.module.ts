import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BanksModule } from './banks/banks.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/common';
import { StockModule } from './stock/stock.module';
import { ServiceModule } from './service/service.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    BanksModule,
    ChatbotModule,
    StockModule,
    ServiceModule,
    DocsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
