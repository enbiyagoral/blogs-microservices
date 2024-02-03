import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { BlogDocument } from "./models/blogs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

@Injectable()
export class BlogsRepository extends AbstractRepository<BlogDocument>{
    protected readonly logger = new Logger(BlogsRepository.name);

    constructor(@InjectModel(BlogDocument.name) blogModel: Model<BlogDocument>){
        super(blogModel)
    }

    async updateMany(query: any, update: any) {
        try {
          const result = await this.model.updateMany(query, update)
          return result
        } catch (error) {
          throw new Error('Error updating documents')
        }
      }

      async deleteMany(filter: FilterQuery<BlogDocument>) {
        const result = await this.model.deleteMany(filter)
        return result
      }
}
