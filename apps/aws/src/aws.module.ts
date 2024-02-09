import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';
import { AwsConfigService } from './config/aws.config';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
  ],
  controllers: [AwsController],
  providers: [AwsService, AwsConfigService],
})
export class AwsModule {}
