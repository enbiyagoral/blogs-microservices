import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BlogDocument } from 'apps/blogs/src/models/blogs.schema'
import mongoose from 'mongoose'

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument { 
  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: false })
  isVerified: boolean

  @Prop()
  birthdate: string

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogDocuments' }] })
  blogs: BlogDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  followers: UserDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  following: UserDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  saved: UserDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  liked: UserDocument[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocuments' }] })
  subscriber: UserDocument[]

//   @Prop({ default: Role.USER, select: true })
//   role: Role[]
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);