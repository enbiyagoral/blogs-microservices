import { Body, Controller, Delete, Get, OnModuleInit, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { AuthGuard, CurrentUser } from '@app/common/auth';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController{
  constructor(private readonly blogsService: BlogsService) {}


  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('blog-photo'))
  async createBlogs(
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
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
  async isExistBlog(@Payload() {slug}:any){
    return await this.blogsService.handleIsExistBlog(slug);
  }

  @MessagePattern({cmd: 'addCommentToBlog'})
  async addCommentToBlog(@Payload() {blogId , commentId}:any){
    return await this.blogsService.handleAddCommentToBlog(blogId, commentId);
  }
}
