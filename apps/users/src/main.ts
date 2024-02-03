import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.connectMicroservice({
    transport : Transport.TCP,
    options: {
      host : '127.0.0.1',
      port: 4010
    }
  })
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices()
  await app.listen(3010);
  Logger.log('User microservice running! TCP_PORT:4010');
}
bootstrap();
