import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    JwtModule,
    LoggerModule,
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4010
        }
      },

      {
        name: 'BLOGS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4020
        }
      },
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
