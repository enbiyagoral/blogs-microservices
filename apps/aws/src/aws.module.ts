import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

@Module({
  imports: [],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
