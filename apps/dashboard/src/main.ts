import { NestFactory } from '@nestjs/core';
import { DashboardModule } from './dashboard.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(DashboardModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4040
    }
  });
  
  app.useLogger(app.get(Logger))
  await app.listen(3040);
}
bootstrap();
