import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [StockService],
  controllers: [StockController]
})
export class StockModule {}
