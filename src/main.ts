import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Get environment
  const nodeEnv = configService.get('NODE_ENV') || 'development';
  
  // Get appropriate frontend URL based on environment
  let frontendUrl: string;
  if (nodeEnv === 'production') {
    frontendUrl = configService.get('FRONTEND_PROD_URL') || 'https://fincrack.com';
  } else {
    frontendUrl = configService.get('FRONTEND_DEV_URL') || 'http://localhost:3001';
  }
  
  console.log(`Using frontend URL for ${nodeEnv} environment: ${frontendUrl}`);
  
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);

  console.log(`API documentation available at /api/docs`);
}
bootstrap();
