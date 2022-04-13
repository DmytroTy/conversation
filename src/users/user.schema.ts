import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Conversation } from '../conversations/conversation.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }] })
  myConversations: Conversation[];
}

export const UserSchema = SchemaFactory.createForClass(User);
