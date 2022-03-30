import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
