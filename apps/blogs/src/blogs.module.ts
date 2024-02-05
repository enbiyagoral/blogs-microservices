import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { DatabaseModule } from '@app/common';
import { BlogDocument, BlogSchema } from './models/blogs.schema';
import { BlogsRepository } from './blogs.repository';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
@Module({
  imports: [
    JwtModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {name: BlogDocument.name, schema: BlogSchema}
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
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
      }
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {}
