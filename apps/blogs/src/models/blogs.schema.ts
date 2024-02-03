import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CategoryDocument } from 'apps/categories/src/models/category.schema'
import { UserDocument } from 'apps/users/src/models/users.schema'
import * as mongoose from 'mongoose'

import slugify from 'slugify'

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
})
export class BlogDocument extends AbstractDocument{
  @Prop({ required: true, maxlength: 60 })
  title: string

  @Prop({ maxlength: 400 })
  description: string

  @Prop({ required: true, minlength: 50, maxlength: 4000 })
  context: string

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  // comments: Comment[]

  @Prop({ type: Date, default: Date.now })
  publishDate: Date

  @Prop(
    { type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments', required: true }
    )
  author: UserDocument

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryDocuments' })
  category: CategoryDocument

  @Prop()
  slug: string

  @Prop()
  image: string

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  likes: UserDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  saves: UserDocument[]
}

export const BlogSchema = SchemaFactory.createForClass(BlogDocument)

BlogSchema.pre('validate', async function (next) {
  // Eğer daha önce slug oluşturulmamışsa veya değişmişse
  if (!this.slug || this.isModified('title')) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000)
    const baseSlug = slugify(this.title, { lower: true, strict: true })
    this.slug = `${baseSlug}-${randomSuffix}`
  }
  next()
})

BlogSchema.virtual('readTime').get(function () {
  const wordsPerMinute = 200
  const words = this.context.split(/\s+/).length
  const readTimeInMinutes = words / wordsPerMinute
  const roundedReadTime = Math.ceil(readTimeInMinutes)
  return roundedReadTime
})
