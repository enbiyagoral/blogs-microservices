import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('BLOGS_CLIENT') private readonly blogsClient: ClientProxy,
    private readonly categoriesRepository: CategoriesRepository){}
  getHello(): string {
    return 'Hello World!';
  }

  async createCategory(createCategoryDto: CreateCategoryDto){
    const result = await this.categoriesRepository.create(createCategoryDto);
    
    return result;
  }

  async getAllCategory() {
    try {
      const categories = await this.categoriesRepository.find({});
      return categories
    } catch (error) {
      console.error('Error getting all categories:', error)
      throw new Error('Error getting all categories')
    }
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoriesRepository.findOne({ slug })
    if (!category) {
      throw new NotFoundException()
    }
    return category
  }

  async updateCategoryBySlug(slug: string, createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoriesRepository.findOne({ slug })

      if (!category) {
        throw new NotFoundException()
      }

      return await this.categoriesRepository.findOneAndUpdate(
        { _id: category._id},
        { name: createCategoryDto.name },
      )

    } catch (error) {
      console.error('Error updating category by id:', error)
      throw new Error('Error updating category by id')
    }
  }

  async deleteCategoryBySlug(slug: string) {
    try {
      const category = await this.categoriesRepository.findOne({ slug })

      if (category) {
        const updateQuery = { category: category._id }
        const updateFields = { $set: { category: null } }

        const removeCategoryFromBlog = await this.blogsClient.send({cmd: 'removeCategoryFromBlog'}, {updateQuery, updateFields}).toPromise();
        const deletedCategory = await this.categoriesRepository.findOneAndDelete({_id: category._id})

        if (!deletedCategory) {
          throw new NotFoundException()
        }

        return deletedCategory
      } else {
        throw new NotFoundException('Category not found')
      }
    } catch (error) {
      console.error('Error deleting category by id:', error)
      throw new Error('Error deleting category by id')
    }
  }

  async handleAddBlogToCategory(blogId: string, categoryId: string){
    const category = await this.categoriesRepository.findOneAndUpdate({_id: categoryId}, {
      $push: {
        blogs: blogId
      }
    });

    return { success: true, message: 'Kategori oluşturuldu!' }
  }

  async handleRemoveBlogFromCategory({categoryId, blogId}){
    const category = await this.categoriesRepository.findOneAndUpdate({_id: categoryId}, {
      $pull: {
        blogs: blogId
      }
    });

    return { success: true, data: category, message: 'Kategori oluşturuldu!' }
  }

}
