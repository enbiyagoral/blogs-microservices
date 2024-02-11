import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AbstractDocument } from '@app/common';
import { BlogDocument } from 'apps/blogs/src/models/blogs.schema';

@Schema({ timestamps: true })
export class CommentDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  context: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BlogDocument', required: true })
  blogId: BlogDocument
}

export const CommentSchema = SchemaFactory.createForClass(CommentDocument);
