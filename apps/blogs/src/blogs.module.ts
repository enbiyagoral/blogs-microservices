import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { DatabaseModule } from '@app/common';
import { BlogDocument, BlogSchema } from './models/blogs.schema';
import { BlogsRepository } from './blogs.repository';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    JwtModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      {name: BlogDocument.name, schema: BlogSchema}
    ]),
    ClientsModule.register([{
      name: 'USERS_SERVICE',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4010
      }
    }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {}
