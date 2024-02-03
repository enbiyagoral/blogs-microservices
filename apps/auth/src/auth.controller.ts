import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('create')
  async handleSignup(@Body() signupDto: SignUpDto){
    return await this.authService.handleSignup(signupDto);
  }

  @Post('login')
  async handleLogin(@Body() signInDto:SignInDto){
    return await this.authService.handleLogin(signInDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'check'})
  async loggedIn(data) {
    try {
      console.log("Buradayız",data)
      const res = this.authService.validateToken(data.jwt);

      return res;
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }
}


