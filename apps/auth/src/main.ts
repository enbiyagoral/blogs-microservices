import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

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

  await app.startAllMicroservices()
  await app.listen(3000);
  Logger.log('Auth microservice running! TCP_PORT: 4000')
}
bootstrap();
