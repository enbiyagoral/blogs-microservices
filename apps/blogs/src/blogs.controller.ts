import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { AuthGuard, CurrentUser } from '@app/common/auth';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createBlogs(
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    console.log("createBlogDto")
    return await this.blogsService.createBlog(userId, createBlogDto, file)
  }

  @Get(':slug')
  async getBlogById(@Param('slug') slug: string) {
    return await this.blogsService.getBlogBySlug(slug)
  }

  @Put(':slug')
  async updateBlogById(@Param('slug') slug: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogsService.updateBlogBySlug(slug, updateBlogDto)
  }

  @Delete(':slug')
  async deleteBlogById(@Param('slug') slug: string) {
    return await this.blogsService.deleteBlogBySlug(slug)
  }

  @MessagePattern({cmd: 'removeCategoryFromBlog'})
  async handleRemoveCategoryFromBlog(@Payload() data: any){
    return await this.blogsService.handleRemoveCategoryFromBlog(data);
  }
}
