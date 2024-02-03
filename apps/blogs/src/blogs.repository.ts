import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { BlogDocument } from "./models/blogs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BlogsRepository extends AbstractRepository<BlogDocument>{
    protected readonly logger = new Logger(BlogsRepository.name);

    constructor(@InjectModel(BlogDocument.name) blogMOdel: Model<BlogDocument>){
        super(blogMOdel)
    }
}
