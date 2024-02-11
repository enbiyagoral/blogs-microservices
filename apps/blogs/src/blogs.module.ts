import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { DatabaseModule } from '@app/common';
import { BlogDocument, BlogSchema } from './models/blogs.schema';
import { BlogsRepository } from './blogs.repository';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import * as Joi from 'joi';


@Module({
  imports: [
    JwtModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {name: BlogDocument.name, schema: BlogSchema}
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ES_INDEX: Joi.string().required(),
      })
    }),
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
        name: 'CATEGORIES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4030
        }
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: 'notifications'
        }
      },
      {
        name: 'AWS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: 'aws'
        }
      },
      {
        name: 'ES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: 'search'
        }
      },
    ]),

  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {}
