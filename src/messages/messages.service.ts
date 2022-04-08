import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Conversation, ConversationDocument } from '../conversations/conversation.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto, client: Socket): Promise<Message> {
    const { conversationID, userID, text } = createMessageDto;
    const createdMessage = new this.messageModel({ text, user: userID, conversation: conversationID });
    const message = await createdMessage.save()

    await this.conversationModel.findByIdAndUpdate(conversationID, { unread: true }, { new: true }).exec();

    // client.to(conversationID).emit('unread', { unread: true });
    client.to(conversationID).emit('newMessage', { message });

    return message;

    /* const conversation = await this.conversationModel.findById(conversationID).exec();
    conversation.messages.push({ text, user: userID });
    conversation.save();
    return  */
  }

  findAllByConversation(conversationID: string): Promise<Message[]> {
    return this.messageModel.find({ conversation: conversationID }).exec();
  }

  findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  update(updateMessageDto: UpdateMessageDto): Promise<Message> {
    const { _id: id, ...updateMessageData } = updateMessageDto;
    return this.messageModel.findByIdAndUpdate(id, updateMessageData, { new: true }).exec();
  }

  remove(id: string): Promise<Message> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
