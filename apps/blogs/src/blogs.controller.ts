import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Patch(':slug/like')
  async likeToBlog(@CurrentUser() currentUser: string, @Param('slug') slug: string) {
    return await this.blogsService.liketoBlog(slug, currentUser)
  }

  @UseGuards(AuthGuard)
  @Patch(':slug/unlike')
  async unlikeToBlog(@CurrentUser() currentUser: string, @Param('slug') slug: string) {
    return await this.blogsService.unliketoBlog(slug, currentUser)
  }

  @UseGuards(AuthGuard)
  @Patch(':slug/save')
  async saveToBlog(@CurrentUser() currentUser: string, @Param('slug') slug: string) {
    return await this.blogsService.savetoBlog(slug, currentUser)
  }

  @UseGuards(AuthGuard)
  @Patch(':slug/unsave')
  async unsaveToBlog(@CurrentUser() currentUser: string, @Param('slug') slug: string) {
    return await this.blogsService.unsavetoBlog(slug, currentUser)
  }

  @Delete(':slug')
  async deleteBlogById(@Param('slug') slug: string) {
    return await this.blogsService.deleteBlogBySlug(slug)
  }

  @MessagePattern({cmd: 'removeCategoryFromBlog'})
  async removeCategoryFromBlog(@Payload() data: any){
    return await this.blogsService.handleRemoveCategoryFromBlog(data);
  }

  @MessagePattern({cmd: 'deleteBlogsFromByUser'})
  async deleteBlogsFromByUser(@Payload() data: any){
    return await this.blogsService.handleDeleteBlogsFromByUser(data);
  }
}
