import { Controller } from '@nestjs/common'
import { SearchService } from './search.service'
import { EventPattern, Payload } from '@nestjs/microservices'

@Controller()
export class SearchMessagingController {
  constructor(private readonly searchService: SearchService) {}

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