// aws.service.ts
import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { AwsConfigService } from './config/aws.config'
import { Readable } from 'stream'

@Injectable()
export class AwsService {
  private s3: S3

  constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3 = new S3({
      accessKeyId: this.awsConfigService.accessKeyId,
      secretAccessKey: this.awsConfigService.secretAccessKey,
    })
  }

  async uploadPhoto(blogId: string, file: Express.Multer.File) {
    const fileStream = Readable.from(file.buffer);

    const uploadParams: S3.PutObjectRequest = {
      Bucket: "imageofblogs",
      Key: String(blogId),
      Body: fileStream,
      ContentType: 'image/jpeg',
    }
    const uploadResult = await this.s3.upload(uploadParams).promise()
    return { success: true, message: 'YÜkleme başarılı', data: uploadResult.Location}
  }
}
