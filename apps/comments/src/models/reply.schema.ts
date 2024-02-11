import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AbstractDocument } from '@app/common';
import { CommentDocument } from './comments.schema';

@Schema({ timestamps: true })
export class ReplyDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  context: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CommentDocument', required: true })
  parentId: CommentDocument
}

export const ReplySchema = SchemaFactory.createForClass(ReplyDocument);
