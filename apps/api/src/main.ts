import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove all fields that are not in DTO
      forbidNonWhitelisted: true, // Throws 400 if there's a field that's not in DTO
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(process.env.PORT ?? 3001);

  console.log(`listening on port ${port}`);
}

bootstrap();
