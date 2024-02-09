import { Controller, Get } from '@nestjs/common';
import { AwsService } from './aws.service';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';

@Controller("aws")
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @MessagePattern({cmd: 'uploadedPhoto'})
  async deneme(@Payload() {blogId, file}: any){
      return await this.awsService.uploadPhoto(blogId, file);
    }
}
