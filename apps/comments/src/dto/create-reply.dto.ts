import { IsString } from "class-validator";

export class CreateReplyDto{
    @IsString()
    context: String;
}