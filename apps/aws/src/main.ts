import { NestFactory } from '@nestjs/core';
import { AwsModule } from './aws.module';

async function bootstrap() {
  const app = await NestFactory.create(AwsModule);
  await app.listen(3000);
}
bootstrap();
