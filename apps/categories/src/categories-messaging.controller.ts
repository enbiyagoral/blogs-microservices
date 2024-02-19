import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CategoriesMessagingController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern({cmd: 'addBlogToCategory'})
  async addBlogToCategory(@Payload() {blogId, categoryId}: any){
    return this.categoriesService.handleAddBlogToCategory(blogId, categoryId);
  }

  @MessagePattern({cmd: 'removeBlogFromCategory'})
  async removeBlogFromCategory(@Payload() data:any){
    return this.categoriesService.handleRemoveBlogFromCategory(data);
  }
}
