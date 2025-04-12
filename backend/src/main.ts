import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { ConfigService } from '@nestjs/config';
import { Env } from './env/env';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('Hackathon DH API')
    .setDescription('WIP')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get<ConfigService<Env>>(ConfigService);

  app.enableCors();

  if (configService.get('NODE_ENV') === 'development') {
    app.enableShutdownHooks();
  }

  if (!configService.get('PORT')) {
    throw new Error('PORT is not defined');
  }

  Logger.log(
    `App running on ${configService.get('NODE_ENV')} mode on port ${configService.get('PORT')}`,
    'Bootstrap',
  );

  await app.listen(configService.get('PORT') as number);
}

void bootstrap();
