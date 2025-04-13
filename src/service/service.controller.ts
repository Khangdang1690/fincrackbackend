import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guard';
import { GetUser } from '@/auth/decorator';
import { User } from '@prisma/client';
import { ServiceService } from './service.service';
import { ServiceRecommendationDto, ServiceRecommendationResponseDto } from '@/service/dto';
import { BaseController } from '@/common';

@UseGuards(JwtAuthGuard)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('recommend')
  async getServiceRecommendation(
    @Body() serviceRecommendationDto: ServiceRecommendationDto,
    @GetUser() user: User,
  ): Promise<ServiceRecommendationResponseDto> {
    console.log(`[${new Date().toISOString()}] Service recommendation route triggered - User ID: ${user.id}, Email: ${user.email}`);
    return this.serviceService.getServiceRecommendation(serviceRecommendationDto, user.id);
  }
} 