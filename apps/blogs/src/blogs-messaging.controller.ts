import { Controller } from '@nestjs/common';
import { BlogsService } from './blogs.service';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { BlogCommentDto } from './dto/blog-comment.dto';

@Controller()
export class BlogsMessagingController{
  constructor(private readonly blogsService: BlogsService) {}

  @MessagePattern({cmd: 'removeCategoryFromBlog'})
  async removeCategoryFromBlog(@Payload() {updateQuery, updateFields}: any){
    return await this.blogsService.handleRemoveCategoryFromBlog({updateQuery, updateFields});
  }

  @MessagePattern({cmd: 'deleteBlogsFromByUser'})
  async deleteBlogsFromByUser(@Payload() data: any){
    return await this.blogsService.handleDeleteBlogsFromByUser(data);
  }

  @MessagePattern({cmd: 'getMostLikedBlogs'})
  async getMostLikedBlogs(@Payload() data:any){
    return await this.blogsService.handleGetMostLikedBlogs(data);
  }

  @MessagePattern({cmd: 'getMostSavedBlogs'})
  async getMostSavedBlogs(@Payload() data:any){
    return await this.blogsService.handleGetMostSavedBlogs(data);
  }

  @MessagePattern({cmd: 'findBlogsByUserId'})
  async findBlogsByUserId(@Payload() data:any){
    return await this.blogsService.handleFindBlogsByUserId(data);
  }

  @MessagePattern({cmd: 'isExistBlog'})
  async isExistBlog(@Payload('slug') slug: string){
    return await this.blogsService.handleIsExistBlog(slug);
  }

  @MessagePattern({cmd: 'addCommentToBlog'})
  async addCommentToBlog(@Payload() data: BlogCommentDto){
    return await this.blogsService.handleAddCommentToBlog(data.blogId, data.commentId);
  }
}
