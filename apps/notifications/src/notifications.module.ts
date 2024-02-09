import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    LoggerModule,
    ClientsModule.register([
      { 
        name: 'USERS_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4010
        }
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
