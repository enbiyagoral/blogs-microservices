import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { CategoryDocument } from "./models/category.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CategoriesRepository extends AbstractRepository<CategoryDocument>{
    protected readonly logger = new Logger(CategoriesRepository.name);

    constructor(@InjectModel(CategoryDocument.name) categoryModel: Model<CategoryDocument>){
        super(categoryModel)
    }

    
}