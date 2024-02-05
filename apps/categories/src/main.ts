import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './categories.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(CategoriesModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4030
    }
  })
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.startAllMicroservices()
  await app.listen(3030);
}
bootstrap();
