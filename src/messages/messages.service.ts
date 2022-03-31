import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { conversationID, userID, text } = createMessageDto;
    const createdMessage = new this.messageModel({ text, user: userID, conversation: conversationID });

    return createdMessage.save();

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

  update(id: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true }).exec();
  }

  remove(id: string): Promise<Message> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
