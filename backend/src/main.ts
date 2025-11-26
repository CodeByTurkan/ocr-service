import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('client');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,HEAD',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Aurora Bank')
    .setDescription('The Aurora Bank API description')
    .setVersion('1.0')
    .addTag('Aurora Bank')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('client/api/v1/openapi', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
