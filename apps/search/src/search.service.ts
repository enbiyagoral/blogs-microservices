import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BlogMapping } from './mapping/blog-index.mapping';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

@Injectable()
export class SearchService {

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
    private readonly logger: Logger) {}

  async createIndex() {
    const existIndex = await this.esService.indices.exists({ index: this.configService.get('ES_INDEX') });
    if (!existIndex) {
      return this.esService.indices.create({
        index: this.configService.get('ES_INDEX'),
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: BlogMapping,
        },
      })
    } else {
      return existIndex
    }
  }

  async addBlog(blog: any) {
    const { id, title, description, context, publishDate, slug } = blog

    const index = await this.esService.index({
      index: this.configService.get('ES_INDEX'),
      id: id,
      body: {
        title,
        description,
        context,
        publishDate,
        slug,
      },
    })
    if (index.body.result === 'created') {
      this.logger.log(`${id} added to ElasticSearch`) 
      return index
    }
  }

  async deleteByQueryBlog(id: any) {
    try {
      const response = await this.esService.deleteByQuery({
        index: this.configService.get('ES_INDEX'),
        body: {
          query: {
            match: {
              _id: id,
            },
          },
        },
      })

      if(response.body.deleted == 1){
        this.logger.log(`${id} deleted to ElasticSearch`) 
        return response
      }
    } catch (error) {
      console.log(error)
    }
  }

  async updateByQueryBlog(id: string, updateBlogDto:any) {
    try {
      const response = await this.esService.update({
        index: this.configService.get('ES_INDEX'),
        id: id,
        body: {
          doc: updateBlogDto,
        },
      })
      this.logger.log(`${id} updated to ElasticSearch`)
      return response
    } catch (error) {
    }
  }

  async search(query: string): Promise<any> {
    const result = await this.esService.search({
      index: this.configService.get('ES_INDEX'),
      body: {
        query: {
          function_score: {
            query: {
              multi_match: {
                query,
                fields: ['title^3', 'description^2', 'context'],
                fuzziness: 'auto',
              },
            },
            functions: [
              {
                filter: { match: { title: query } },
                weight: 3,
              },
              {
                filter: { match: { description: query } },
                weight: 2,
              },
            ],
            score_mode: 'sum',
          },
        },
      },
    })

    return result.body.hits.hits
  }
}