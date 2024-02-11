import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { BlogsRepository } from './blogs.repository';
import { ClientProxy } from '@nestjs/microservices';
import { BlogDocument } from './models/blogs.schema';

@Injectable()
export class BlogsService {

  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('CATEGORIES_SERVICE') private readonly categoriesClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationsService: ClientProxy,
    @Inject('AWS_SERVICE') private readonly awsClient: ClientProxy,
    @Inject('ES_SERVICE') private readonly esClient: ClientProxy,

  private readonly blogsRepository: BlogsRepository){}

  async createBlog(userId: string, createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    try {
      const { title, description, context, category } = createBlogDto
      const blog = await this.blogsRepository.create({
        ...createBlogDto,
        author: userId
      });

      // Kullanıcıya blog ekle
      const userPayload = { blogId: blog._id, authorId: blog.author};
      const addBLogFromUser = await this.usersClient.send({cmd:'addBlogFromUser'}, userPayload).toPromise();
      
      // Kategoriye blog ekle
      const categoryPayload = { categoryId: category, blogId: blog._id }
      const addBlogToCategory = await this.categoriesClient.send({cmd: 'addBlogToCategory'}, categoryPayload).toPromise();

      if (file) {
        // const parms = { blogId: blog._id, file:file}
        // console.log(parms);
        // const uploadPhoto = this.awsClient.emit('uploadedPhoto', parms).toPromise();
        // const uploadPhoto = await this.awsService.uploadPhoto(newBlog.id.toString(), file)
        // newBlog.image = uploadPhoto.Location
        // await newBlog.save()
      }

      // Abonelere bildirim gönder
      await this.notificationsService.emit('notify_email', { userId, blogLink: blog.slug}).toPromise();

      // ElasticSearch'e bloğu ekle.
      await this.esClient.emit('blogAdded',{blog}).toPromise();
      
      return blog;

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
      
      await this.esClient.emit('blogUpdated', { blog: blog._id, updatedFieldDto: updatedFields}).toPromise();

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

      // Kullanıcının listesinden kaldırma işlemi
      const userPayload = { authorId: blog.author.toString(), blogId: blog._id}
      const removeBlogFromUser = this.usersClient.send({cmd: 'removeBlogFromUser'}, userPayload).toPromise();

      // Kategorilerden kaldırma işlemi
      const categoryPayload = { categoryId: blog.category._id, blogId: blog._id};
      const removeBlogFromCategory = this.categoriesClient.send({cmd: 'removeBlogFromCategory'}, categoryPayload).toPromise();

      // Elastic Search'ten kaldırma işlemi.
      await this.esClient.emit('blogDeleted', { blog: blog._id}).toPromise();

      return blog
    } catch (error) {
      console.error('Error deleting blog by id:', error)
      throw new Error('Error deleting blog by id')
    }
  }

  async handleRemoveCategoryFromBlog({updateQuery, updateFields}: any){
    const result = await this.blogsRepository.updateMany(updateQuery, updateFields);
    return { success: true, message: "Removed Category From Blog", data: "null"};
  }

  async handleDeleteBlogsFromByUser({authorId}: any){
    const result = await this.blogsRepository.deleteMany({author: authorId})
    console.log(result);
    return result;
  }

  async handleGetMostLikedBlogs({ payload }: any) {
    const filter: string = payload;
  
    const blogs = await this.blogsRepository.find({});
    
    const result = blogs.sort((a: BlogDocument, b: BlogDocument) => {
      return b[filter] - a[filter];
    });
  
    return result;
  }

  async handleGetMostSavedBlogs({payload}: any){
    const filter: string = payload;
  
    const blogs = await this.blogsRepository.find({});
    
    const result = blogs.sort((a: BlogDocument, b: BlogDocument) => {
      return b[filter] - a[filter];
    });
  
    return result;
  }

  async handleFindBlogsByUserId({payload}: any){
    return await this.blogsRepository.find({ author: { $in: [payload._id] } });
    
  }
  
}
