import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('BLOGS_SERVICE') private readonly blogsClient: ClientProxy
    ){}


  async getHomePage(currentUserId: string) {
    const followingUsers = await this.usersClient.send({cmd: 'getFollowingUsers'}, {_id: currentUserId}).toPromise();
    console.log(followingUsers);
    const blogsPromises = followingUsers.map((user)=> this.blogsClient.send({cmd: 'findBlogsByUserId'}, { authorId: user.toString()}))
    const blogs = await Promise.all(blogsPromises)
    const sortedBlogs = [].concat(...blogs).sort((a, b) => b.publishDate - a.publishDate)
    return sortedBlogs
  }

  async getMostLikedBlogs() {
    const getMostLikedBlogs = this.blogsClient.send({cmd: 'getMostLikedBlogs'}, {payload:'likes'}).toPromise()
    return getMostLikedBlogs
  }

  async getMostSavedBlogs() {
    const getMostSavedBlogs = this.blogsClient.send({cmd: 'getMostSavedBlogs'}, {payload:'saves'}).toPromise()
    return getMostSavedBlogs
  }
}


