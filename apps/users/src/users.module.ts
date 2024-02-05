import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UserDocument, UserSchema } from './models/users.schema';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    JwtModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {name: UserDocument.name, schema: UserSchema}
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      })
    }),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4000
      }
    },
    {
      name: 'BLOGS_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4020
      }
    }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
