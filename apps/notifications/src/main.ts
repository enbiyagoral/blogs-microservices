import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger));
  app.connectMicroservice({
    transport: Transport.RMQ,
    options:  {
      urls: ["amqp://localhost:5672"],
      queue: 'notifications'
    }
  });
  await app.startAllMicroservices()
  await app.listen(3060);
}
bootstrap();
