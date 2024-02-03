import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BlogDocument } from "apps/blogs/src/models/blogs.schema";
import mongoose from "mongoose";
import slugify from "slugify";

@Schema({timestamps: true})
export class CategoryDocument extends AbstractDocument{
    @Prop({ unique: true, required: true, maxlength: 80 })
    name: string
  
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogDocuments' }] })
    blogs: BlogDocument[]
  
    @Prop()
    slug: string
}

export const CategorySchema = SchemaFactory.createForClass(CategoryDocument)

CategorySchema.pre('validate', function (next) {
    if (!this.slug || this.isModified('name')) {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000)
      const baseSlug = slugify(this.name, { lower: true, strict: true })
      this.slug = `${baseSlug}-${randomSuffix}`
    }
    next()
  })