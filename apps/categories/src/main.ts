import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './categories.module';

async function bootstrap() {
  const app = await NestFactory.create(CategoriesModule);
  await app.listen(3000);
}
bootstrap();
