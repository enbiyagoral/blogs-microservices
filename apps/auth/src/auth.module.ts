import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import constants from '../../../libs/common/src/auth/constants';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4010,      
        }
      },
    ]),
    JwtModule.register({
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '30d' }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule {}
 