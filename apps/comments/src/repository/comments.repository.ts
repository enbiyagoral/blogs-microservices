import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentDocument } from "../models/comments.schema";

@Injectable()
export class CommentRepository extends AbstractRepository<CommentDocument>{
    protected readonly logger = new Logger(CommentRepository.name);

    constructor(@InjectModel(CommentDocument.name) commentModel: Model<CommentDocument>){
        super(commentModel)
    }

    
}