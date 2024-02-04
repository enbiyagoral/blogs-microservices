import { Body, Controller, Get, Logger, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { ChangePasswordDto, SignInDto, SignUpDto } from './dto/index';

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

  @Post('/forgot-password-request')
  forgotPasswordRequest(@Body('email') email: string) {
    return this.authService.forgotPasswordRequest(email)
  }

  @Patch('/forgot-password/')
  forgotPassword(@Body() changePasswordDto: ChangePasswordDto, @Query('token') token: string, @Query('id') id: string) {
    return this.authService.forgotPassword(token, id, changePasswordDto)
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


