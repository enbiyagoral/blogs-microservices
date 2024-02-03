import { Injectable } from '@nestjs/common'

@Injectable()
export class AwsConfigService {
  readonly accessKeyId: string = process.env.ACCESS_KEY_ID
  readonly secretAccessKey: string = process.env.SECRET_ACCESS_KEY
  readonly bucketName: string = process.env.AWS_S3_BUCKET
}
