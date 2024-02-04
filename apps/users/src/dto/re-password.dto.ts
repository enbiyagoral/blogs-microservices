import { IsString } from 'class-validator'
import { ChangePasswordDto } from './change-password.dto'

export class RePasswordDto extends ChangePasswordDto {
  @IsString()
  password: string
}