import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options:  {
      urls: ["amqp://localhost:5672"],
      queue: 'search'
    }
  })
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger));
  app.startAllMicroservices()

  await app.listen(3071);
}
bootstrap();
