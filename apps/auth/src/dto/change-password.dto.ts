import { IsString } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  newPassword: string

  @IsString()
  confirmPassword: string
}