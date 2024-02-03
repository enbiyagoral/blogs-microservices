import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto';
import { BlogsRepository } from './blogs.repository';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly blogsRepository: BlogsRepository
    ){}
  getHello(): string {
    return 'Hello World!';
  }

  async create(userId: string, createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    try {
      const { title, description, context, 
        // category 
      } = createBlogDto

      const blog = Object.assign({}, createBlogDto, { author: userId})

      const newBlog = await this.blogsRepository.create(blog)
      console.log(newBlog);

      
      const payload = { blogId: newBlog._id, authorId: newBlog.author};
      const addBLogFromUser = this.usersClient.send({cmd:'addBlogFromUser'}, payload).toPromise();
      return newBlog;
      
      // if (file) {
      //   console.log('object')
      //   // const uploadPhoto = await this.awsService.uploadPhoto(newBlog.id.toString(), file)
      //   // newBlog.image = uploadPhoto.Location
      //   // await newBlog.save()
      //   console.log('Fotoğraf yüklendi!')
      // }

      // const _category = await this.blogsCommonService.getCategoryById(category.toString())
      // _category.blogs.push(newBlog)
      // await _category.save()

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
}
