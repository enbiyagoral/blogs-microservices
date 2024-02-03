import { IsMongoId, IsOptional, IsString, Length } from 'class-validator'
import { ObjectId } from 'mongoose'

export class CreateBlogDto {
  @IsString()
  @Length(1, 60)
  title: string

  @IsString()
  @Length(1, 400)
  @IsOptional()
  description: string

  @IsString()
  @Length(50, 4000)
  context: string

  // @IsMongoId()
  // category: ObjectId
}
