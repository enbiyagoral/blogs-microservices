import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ReplyDocument } from "../models/reply.schema";

@Injectable()
export class ReplyRepository extends AbstractRepository<ReplyDocument>{
    protected readonly logger = new Logger(ReplyRepository.name);

    constructor(@InjectModel(ReplyDocument.name) replyModel: Model<ReplyDocument>){
        super(replyModel)
    }


}