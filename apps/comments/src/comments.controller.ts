import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':slug')
  async createComment(
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto){
      return await this.commentsService.createComment(slug, createCommentDto);
  }

  @Post(':commentId/reply')
  async createReply(@Param('commentId') commentId: string,
  @Body() createCommentDto: CreateReplyDto){
    return await this.commentsService.createReply(commentId, createCommentDto);
}












}
