import { IsString } from "class-validator";

export class BlogCommentDto{
    @IsString()
    blogId: string;
    @IsString()
    commentId: string;
}