import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { Transport } from '@nestjs/microservices';
import { Logger} from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);  
  app.connectMicroservice({
    transport : Transport.TCP,
    options: {
      host : 'localhost',
      port: 4010
    }
  })
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger))
  await app.startAllMicroservices()
  await app.listen(3010);
}
bootstrap();
