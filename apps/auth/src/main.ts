import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options:  {
      host: 'localhost',
      port: 4000
    }
  })
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger))
  await app.startAllMicroservices()
  await app.listen(3000);
}
bootstrap();
