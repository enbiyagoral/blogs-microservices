import { NestFactory } from '@nestjs/core';
import { BlogsModule } from './blogs.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BlogsModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4020
    }
  })
  app.useGlobalPipes(new ValidationPipe())

  await app.startAllMicroservices()
  await app.listen(3020);
  Logger.log('Blogs microservice running! TCP_PORT: 4020')
}
bootstrap();
