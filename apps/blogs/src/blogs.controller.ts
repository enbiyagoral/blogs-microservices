import { Body, Controller, Get, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { AuthGuard, CurrentUser } from '@app/common/auth';
import { CreateBlogDto } from './dto';

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
    return await this.blogsService.create(userId, createBlogDto, file)
  }
}
