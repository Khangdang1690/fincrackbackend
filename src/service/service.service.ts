import { Injectable } from '@nestjs/common';
import { BaseService } from '@/common';
import { ServiceRecommendation } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ServiceApiResponse, ServiceRecommendationDto, ServiceRecommendationResponseDto } from '@/service/dto';

@Injectable()
export class ServiceService extends BaseService<ServiceRecommendation> {
  protected readonly modelName = 'serviceRecommendation';

  constructor(
    protected readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super(prisma);
  }

  /**
   * Get service recommendation based on user input
   * @param serviceRecommendationDto The service recommendation input data
   * @param userId The user ID
   * @returns The best service recommendation
   */
  async getServiceRecommendation(
    serviceRecommendationDto: ServiceRecommendationDto,
    userId: string,
  ): Promise<ServiceRecommendationResponseDto> {
    try {
      // Get the appropriate API URL based on environment
      const nodeEnv = this.configService.get('NODE_ENV') || 'development';
      let baseUrl: string;
      
      if (nodeEnv === 'production') {
        baseUrl = this.configService.get('SERVICE_BASE_URL_PROD') || '';
      } else {
        baseUrl = this.configService.get('SERVICE_BASE_URL_DEV') || '';
      }
      
      if (!baseUrl) {
        throw new Error('Service API URL not configured properly');
      }

      console.log(`Using service API URL: ${baseUrl} for environment: ${nodeEnv}`);
      
      // Call the external API
      const response = await firstValueFrom(
        this.httpService.post<ServiceApiResponse>(`${baseUrl}/recommend`, serviceRecommendationDto)
      );
      
      const apiResponse = response.data;
      
      // Store the recommendation in the database
      await this.prisma.serviceRecommendation.create({
        data: {
          userId,
          age: serviceRecommendationDto.Age,
          gender: serviceRecommendationDto.Gender,
          maritalStatus: serviceRecommendationDto['Marital Status'],
          incomeLevel: serviceRecommendationDto['Income Level'],
          occupation: serviceRecommendationDto.Occupation,
          residentialStatus: serviceRecommendationDto['Residential Status'],
          dependents: serviceRecommendationDto.Dependents,
          debtToIncome: serviceRecommendationDto['Debt-to-Income'],
          creditScore: serviceRecommendationDto['Credit Score'],
          employmentStatus: serviceRecommendationDto['Employment Status'],
          loanPurpose: serviceRecommendationDto['Loan Purpose'],
          bestRecommendation: apiResponse.best_recommendation,
        },
      });
      
      // Return only the best recommendation
      return {
        best_recommendation: apiResponse.best_recommendation,
      };
    } catch (error) {
      console.error('Error in service recommendation:', error.message);
      throw new Error(`Failed to get service recommendation: ${error.message}`);
    }
  }
} 