import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from '../messages/message.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  unreadMessageFromUser: string;

  @Prop({
    type: Map,
    of: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
    },
  })
  users: Map<String, Object>;

  @Prop({ type: [{
    text: String,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
