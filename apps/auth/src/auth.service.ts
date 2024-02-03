import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { TimeoutError, catchError, from, map, throwError, timeout } from 'rxjs';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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

      if(compareSync(password, user?.password)) {
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
  