import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './repository/comments.repository';
import { ReplyRepository } from './repository/reply.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class CommentsService {  
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly replyRepository: ReplyRepository,
    @Inject('BLOGS_CLIENT') private readonly blogsClient: ClientProxy,
    ){}
  
  async createComment(slug: string, createCommentDto: CreateCommentDto) {
    try {
      const isExistBlog = await this.blogsClient.send({cmd: 'isExistBlog'}, { slug }).toPromise();
      if(!isExistBlog){
        throw new NotFoundException('Blog not found!');
      }
      const comment = await this.commentRepository.create({blogId: isExistBlog, context: createCommentDto.context});
      
      const blog = await this.blogsClient.send({cmd: 'addCommentToBlog'}, { blogId: isExistBlog, commentId: comment._id }).toPromise()

      return comment;
    } catch (error) {
     console.log(error) 
    }
  }

  async createReply(commentId: string, createCommentDto: CreateReplyDto) {
    try {
      const isExistComment = await this.commentRepository.findOne({_id: commentId});
      const reply = await this.replyRepository.create({parentId: isExistComment._id, context: createCommentDto.context});
      return reply;
    } catch (error) {
      
    }
  }

}
