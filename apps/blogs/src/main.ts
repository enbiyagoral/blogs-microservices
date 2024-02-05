import { NestFactory } from '@nestjs/core';
import { BlogsModule } from './blogs.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino'


async function bootstrap() {
  const app = await NestFactory.create(BlogsModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger));
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4020
    }
  })

  await app.startAllMicroservices()
  await app.listen(3020);
}
bootstrap();
