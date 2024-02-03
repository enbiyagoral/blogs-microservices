import { IsDateString, IsString } from 'class-validator'
import { SignInDto } from './sign-in.dto'

export class SignUpDto extends SignInDto {
  @IsString()
  username: string

  @IsString()
  birthdate: string
}
