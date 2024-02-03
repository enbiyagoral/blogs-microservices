import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { BlogsRepository } from './blogs.repository';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('CATEGORIES_SERVICE') private readonly categoriesClient: ClientProxy,
    private readonly blogsRepository: BlogsRepository
    ){}
  getHello(): string {
    return 'Hello World!';
  }

  async createBlog(userId: string, createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    try {
      const { title, description, context, category } = createBlogDto

      const blog = Object.assign({}, createBlogDto, { author: userId})

      const newBlog = await this.blogsRepository.create(blog)
      console.log(newBlog);

      
      const userPayload = { blogId: newBlog._id, authorId: newBlog.author};
      const addBLogFromUser = this.usersClient.send({cmd:'addBlogFromUser'}, userPayload).toPromise();
      
      const categoryPayload = { categoryId: category, blogId: newBlog._id }
      const addBlogToCategory = this.categoriesClient.send({cmd: 'addBlogToCategory'}, categoryPayload).toPromise();
      
      return newBlog;


      // if (file) {
      //   console.log('object')
      //   // const uploadPhoto = await this.awsService.uploadPhoto(newBlog.id.toString(), file)
      //   // newBlog.image = uploadPhoto.Location
      //   // await newBlog.save()
      //   console.log('Fotoğraf yüklendi!')
      // }

     

      // const userEmails = await this.blogsCommonService.getSubscriber(userId)

      // await Promise.all(
      //   userEmails.map(async (userEmail) => {
      //     this.mailService.subscribeBlogs(userEmail, newBlog.id)
      //   }),
      // )

      // await this.esService.addBlog(newBlog)


      // return { newBlog }
    } catch (error) {
      console.error('Error creating blog:', error)
      throw new Error('Error creating blog')
    }
  }

  async getBlogBySlug(slug: string) {
    try {
      const blog = await this.blogsRepository.findOne({ slug })

      if (!blog) {
        throw new NotFoundException('Blog not found')
      }

      return blog
    }catch (error) {
      console.error('Error getting blog by id:', error)

      throw new Error('Error getting blog by id')
    }
  }

  async updateBlogBySlug(slug: string, updateBlogDto: UpdateBlogDto) {
    try {
      const blog = await this.blogsRepository.findOne({ slug })
      if (!blog) {
        throw new NotFoundException('Blog not found')
      }
      const updatedFields: { [key: string]: any } = {};

      if (updateBlogDto.title !== undefined) {
        updatedFields.title = updateBlogDto.title;
      }

      if (updateBlogDto.description !== undefined) {
        updatedFields.description = updateBlogDto.description;
      }

      if (updateBlogDto.context !== undefined) {
        updatedFields.context = updateBlogDto.context;
      }

      const updatedBlog = await this.blogsRepository.findOneAndUpdate(
        { _id: blog._id },
        { $set: updatedFields },
      );

      if (!updatedBlog) {
        throw new Error('Error updating blog');
      }

    return updatedBlog;

    } catch (error) {
      console.error('Error updating blog by id:', error)
      throw new Error('Error updating blog by id')
    }
  }

  async liketoBlog(slug: string, currentUser) {
    const blog = await this.blogsRepository.findOne({ slug })

    if (!blog) {
      throw new NotFoundException('Blog not found')
    }
    console.log(blog.likes);
    if (!blog.likes.map(String).includes(currentUser)) {
      // User
      const userPayload = { userId: currentUser, blogId: blog._id}
      const addLikeToUser = this.usersClient.send({cmd: 'addLikeToUser'}, userPayload).toPromise();

      return await this.blogsRepository.findOneAndUpdate({slug}, {
        $push: {
          likes: currentUser
        }
      });
      
    }
    return 'Already Liked to Blog'
  }

  async unliketoBlog(slug: string, currentUser) {
    const blog = await this.blogsRepository.findOne({ slug })
    if (!blog) {
      throw new NotFoundException('Blog not found')
    }

    if (blog.likes.map(String).includes(currentUser)) {
      // User,
      const userPayload = { userId: currentUser, blogId: blog._id}
      const removeLikeToUser = this.usersClient.send({cmd: 'removeLikeToUser'}, userPayload).toPromise();

      return await this.blogsRepository.findOneAndUpdate({slug}, {
        $pull: {
          likes: currentUser
        }
      });
    }

    return 'Already Not liked to Blog'
  }

  async savetoBlog(slug: string, currentUser) {
    const blog = await this.blogsRepository.findOne({ slug })
    if (!blog) {
      throw new NotFoundException('Blog not found')
    }

    if (!blog.saves.map(String).includes(currentUser)) {
      // User
      const userPayload = { userId: currentUser, blogId: blog._id}
      const addSaveToUser = this.usersClient.send({cmd: 'addSaveToUser'}, userPayload).toPromise();

      return await this.blogsRepository.findOneAndUpdate({slug}, {
        $push: {
          saves: currentUser
        }
      });
    }
    return 'Already Saved to Blog'
  }

  async unsavetoBlog(slug: string, currentUser) {
    const blog = await this.blogsRepository.findOne({ slug: slug })

    if (!blog) {
      throw new NotFoundException('Blog not found')
    }

    if (blog.saves.map(String).includes(currentUser)) {
      // User
      // await this.blogsCommonService.removeSavedFromUser(currentUser, blog.id)

      const userPayload = { userId: currentUser, blogId: blog._id}
      const removeSaveToUser = this.usersClient.send({cmd: 'removeSaveToUser'}, userPayload).toPromise();

      return await this.blogsRepository.findOneAndUpdate({slug}, {
        $pull: {
          saves: currentUser
        }
      });
    }
    return 'Already Not Saved to Blog'
  }


  async deleteBlogBySlug(slug: string) {
    try {
      const blog = await this.blogsRepository.findOneAndDelete({ slug })

      if (!blog) {
        throw new NotFoundException('Blog not found')
      }

      // await this.blogsCommonService.removeCommentFromBlog(blog.id)
      const userPayload = { authorId: blog.author.toString(), blogId: blog._id}
      const removeBlogFromUser = this.usersClient.send({cmd: 'removeBlogFromUser'}, userPayload).toPromise();
      const categoryPayload = { categoryId: blog.category._id, blogId: blog._id};
      const removeBlogFromCategory = this.categoriesClient.send({cmd: 'removeBlogFromCategory'}, categoryPayload).toPromise();
      // await this.esService.deleteByQueryBlog(blog.id)

      return blog
    } catch (error) {
      console.error('Error deleting blog by id:', error)
      throw new Error('Error deleting blog by id')
    }
  }

  async handleRemoveCategoryFromBlog({updateQuery, updateFields}: any){
    const result = await this.blogsRepository.updateMany(updateQuery, updateFields);
    return result;
  }
}
