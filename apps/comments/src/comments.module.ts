import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CommentRepository } from './repository/comments.repository';
import { CommentDocument, CommentSchema } from './models/comments.schema';
import { ReplyDocument, ReplySchema } from './models/reply.schema';
import { ReplyRepository } from './repository/reply.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {name: CommentDocument.name, schema: CommentSchema},
      {name: ReplyDocument.name, schema: ReplySchema},
  ]),
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
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository, ReplyRepository],
})
export class CommentsModule {}
