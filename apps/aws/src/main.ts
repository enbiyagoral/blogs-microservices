import { NestFactory } from '@nestjs/core';
import { AwsModule } from './aws.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AwsModule);
 
  app.connectMicroservice({
    transport: Transport.RMQ,
    options:  {
      urls: ["amqp://localhost:5672"],
      queue: 'aws'
    }
  })
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger));

  app.startAllMicroservices()
  await app.listen(3050);
}
bootstrap();
