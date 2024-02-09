import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto } from './dto';

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategory() {
    return await this.categoriesService.getAllCategory()
  }

  @Get(':slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return await this.categoriesService.getCategoryBySlug(slug)
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategoryDto)
  }

  @Put(':slug')
  async updateCategory(@Param('slug') slug: string, @Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.updateCategoryBySlug(slug, createCategoryDto)
  }

  @Delete(':slug')
  async deleteCategory(@Param('slug') slug: string) {
    return await this.categoriesService.deleteCategoryBySlug(slug)
  }

  @MessagePattern({cmd: 'addBlogToCategory'})
  async addBlogToCategory(@Payload() data: any){
    console.log(data);
    return this.categoriesService.handleAddBlogToCategory(data);
  }

  @MessagePattern({cmd: 'removeBlogFromCategory'})
  async removeBlogFromCategory(@Payload() data:any){
    return this.categoriesService.handleRemoveBlogFromCategory(data);
  }

 
}
