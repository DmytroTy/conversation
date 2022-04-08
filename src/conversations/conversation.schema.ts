import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from '../messages/message.schema';
import { User } from '../users/user.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop()
  name: string;

  @Prop()
  unread: boolean;

  @Prop({
    type: Map,
    of: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  users: Map<String, User>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
