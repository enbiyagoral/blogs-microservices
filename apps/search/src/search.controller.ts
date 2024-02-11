import { Controller, Post, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { EventPattern, Payload } from '@nestjs/microservices'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async searchingBlog(@Query('q') query: string) {
    return await this.searchService.search(query)
  }

  @EventPattern('blogAdded')
  async handleBlogAdded(@Payload() {blog}: any){
    return await this.searchService.addBlog(blog);
  }

  @EventPattern('blogDeleted')
  async handleBlogDeleted(@Payload() {blog}: any){
    return await this.searchService.deleteByQueryBlog(blog);
  }

  @EventPattern('blogUpdated')
  async handleBlogUpdated(@Payload() {blog, updatedFieldDto}: any){
    console.log(updatedFieldDto);
    return await this.searchService.updateByQueryBlog(blog, updatedFieldDto);
  }
}