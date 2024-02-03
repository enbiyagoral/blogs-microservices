import { IsString, MaxLength } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @MaxLength(80)
  name: string
}