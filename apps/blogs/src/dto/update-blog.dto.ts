import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateBlogDto {
  @IsString()
  @Length(1, 60)
  @IsOptional()
  title?: string

  @IsString()
  @Length(1, 100)
  @IsOptional()
  description?: string

  @IsString()
  @Length(50, 2000)
  @IsOptional()
  context?: string
}
