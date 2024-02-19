import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { CategoryDocument, CategorySchema } from './models/category.schema';
import { CategoriesRepository } from './categories.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { join } from 'path';
import { CategoriesMessagingController } from './categories-messaging.controller';


@Module({
  imports: [ 
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CategoryDocument.name, schema: CategorySchema }
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      })
    }),
    ClientsModule.register([
      { 
        name: 'BLOGS_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4020
        }
      }
    ]),
  ],
  controllers: [CategoriesController, CategoriesMessagingController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
