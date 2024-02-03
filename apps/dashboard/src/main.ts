import { NestFactory } from '@nestjs/core';
import { DashboardModule } from './dashboard.module';

async function bootstrap() {
  const app = await NestFactory.create(DashboardModule);
  await app.listen(3000);
}
bootstrap();
