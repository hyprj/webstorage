import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;
  console.log(`listening on port ${port}`);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
