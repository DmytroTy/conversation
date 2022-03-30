import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Message } from '../messages/message.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
