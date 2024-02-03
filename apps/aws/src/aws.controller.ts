import { Controller, Get } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller()
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get()
  getHello(): string {
    return this.awsService.getHello();
  }
}
