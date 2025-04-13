import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class ServiceRecommendationDto {
  @IsInt()
  @Min(18)
  @Max(100)
  'Age': number;

  @IsString()
  'Gender': string;

  @IsString()
  'Marital Status': string;

  @IsString()
  'Income Level': string;

  @IsString()
  'Occupation': string;

  @IsString()
  'Residential Status': string;

  @IsInt()
  @Min(0)
  'Dependents': number;

  @IsNumber()
  @Min(0)
  @Max(1)
  'Debt-to-Income': number;

  @IsInt()
  @Min(300)
  @Max(850)
  'Credit Score': number;

  @IsString()
  'Employment Status': string;

  @IsString()
  'Loan Purpose': string;
}

export interface ServiceRecommendationResponseDto {
  best_recommendation: string;
}

export interface ServiceApiResponse {
  ranked_recommendations: [string, number][];
  best_recommendation: string;
} 