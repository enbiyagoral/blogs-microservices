import { Inject, Injectable, Logger, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService){}
  getHello(): string {
    return 'Hello World!';
  }

  async handleSignup(signupDto: SignUpDto){
    try {

      const response = await this.usersClient.send('handleSignup', {signupDto})
      return response

    } catch (error) {
      console.error('Error while emitting handleSignup:', error.message);
      throw error;
    }
  }

  async handleLogin(signInDto:SignInDto){
    try {

      const response = await this.usersClient.send('handleLogin', {signInDto}).toPromise();
      const payload = { userId: response.data._id, email: response.data.email};
      return {
        userId: response.data._id,
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {secret: 'refreshTOken'})
      }

      

    } catch (error) {
      console.error('Error while emitting handleSignup:', error.message);
      throw error;
    }
  }

  async forgotPasswordRequest(email: string) {
    const user = await this.usersClient.send({ cmd: 'get' }, {email}).toPromise();

    if (!user) throw new UnauthorizedException()
    const payload = { userId: user._id }

    const token = await this.jwtService.signAsync(
      { payload },
      {
        secret: "process.env.JWT_ACCESS_SECRET",
        expiresIn: '15m',
      },
    )

    return `http://localhost:3000/auth/forgot-password/?token=${token}&id=${user._id}`
  }

  async forgotPassword(token: string, id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersClient.send({cmd: 'getUseById'},{ _id: id }).toPromise();
    console.log(user);
    if (!user) throw new UnauthorizedException()

    const decoded = await this.jwtService.verifyAsync(token, { secret: "process.env.JWT_ACCESS_SECRET" })

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword)
      throw new UnauthorizedException('Girmek istediğiniz yeni şifreler aynı değil.')
    const isSamePassword = await bcrypt.compare(changePasswordDto.confirmPassword, user.password)
    if (isSamePassword) throw new UnauthorizedException('Eski şifreniz ile yeni şifreniz aynı olamaz!')

    const hashedPassword = await bcrypt.hash(changePasswordDto.confirmPassword, 10)
    
    const updatedPasswordByUser = await this.usersClient.send({cmd: 'updatedPasswordByUser'}, {_id: user._id, password: hashedPassword}).toPromise();
    return 'Şifre değiştirildi'
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersClient.send({cmd: 'get' }, { email })
      .pipe(
        timeout(5000), 
        catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),)
      .toPromise();

      if(bcrypt.compareSync(password, user?.password)) {
        return user;
      }

      return null;
    } catch(e) {
      Logger.log(e);
      throw e;
    }
  }

  async validateToken(jwt: string) {
    try {
      return this.jwtService.verify(jwt);
    } catch(e) {
      Logger.log(e);
      throw e;
    }
  }
}
  