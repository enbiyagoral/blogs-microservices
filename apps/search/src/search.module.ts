import { Module, OnModuleInit } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ES_INDEX: Joi.string().required(),
      }),
    }),
    LoggerModule,
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    })
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule implements OnModuleInit{
  constructor(private searchService: SearchService){}
  onModuleInit() {
    this.searchService.createIndex().then();
  }
}
