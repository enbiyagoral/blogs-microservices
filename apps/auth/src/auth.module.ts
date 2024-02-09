import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import constants from '../../../libs/common/src/auth/constants';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4010,      
        }
      },
    ]),
    LoggerModule,
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
 