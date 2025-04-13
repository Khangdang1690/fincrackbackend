import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {} 