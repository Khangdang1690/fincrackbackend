# FinCrack API Documentation

This directory contains comprehensive API documentation for the FinCrack backend in OpenAPI/Swagger format.

## Using the API Documentation

The API documentation is available in the file `api-doc.yaml`, which follows the OpenAPI 3.0 specification. You can use this file in several ways:

### 1. Swagger UI

To view the API documentation in a user-friendly interface, you can use Swagger UI:

1. Go to [Swagger Editor](https://editor.swagger.io/)
2. Import the `api-doc.yaml` file
3. The documentation will be displayed in an interactive format

### 2. Setting Up Swagger UI in the Application

To add Swagger UI directly to your NestJS application:

1. Install the required packages:
   ```bash
   npm install @nestjs/swagger swagger-ui-express
   ```

2. Update your `main.ts` file:
   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
   import { AppModule } from './app.module';
   import * as fs from 'fs';
   import * as YAML from 'yaml';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     
     // Read the OpenAPI documentation
     const apiDocYaml = fs.readFileSync('./src/common/api-doc.yaml', 'utf8');
     const apiDoc = YAML.parse(apiDocYaml);
     
     // Set up Swagger
     const document = SwaggerModule.createDocument(app, new DocumentBuilder().build(), {
       ignoreGlobalPrefix: false,
     });
     
     // Merge the manually created documentation
     Object.assign(document, apiDoc);
     
     SwaggerModule.setup('api/docs', app, document);
     
     await app.listen(3000);
   }
   bootstrap();
   ```

3. Access your API documentation at `http://localhost:3000/api/docs`

## Documentation Structure

The API documentation includes:

1. **Authentication Endpoints** (`/auth/*`):
   - User signup and login

2. **User Endpoints** (`/users/*`):
   - Get and update user profile

3. **Stock Endpoints** (`/stock/*`):
   - Manage stock wishlist
   - Get stock metrics

4. **Bank Endpoints** (`/banks/*`):
   - Get bank recommendations

5. **Service Endpoints** (`/service/*`):
   - Get service recommendations

Each endpoint includes:
- Description
- Required parameters
- Request body schema with examples
- Response schema with examples
- Possible error responses
- Authentication requirements

## Sample Data

The documentation includes realistic sample data for all request and response bodies, making it easy to understand the expected format of each API call.

## Authentication

Most endpoints require authentication using JWT tokens. The documentation uses the `bearerAuth` security scheme to indicate protected endpoints.

## Updating the Documentation

When adding new endpoints or modifying existing ones, please update the `api-doc.yaml` file to keep the documentation in sync with the implementation. 