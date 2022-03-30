import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(@InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>) {}

  create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const createdConversation = new this.conversationModel(createConversationDto);
    return createdConversation.save();
  }

  findAll(): Promise<Conversation[]> {
    return this.conversationModel.find({}).exec();
  }

  findOne(id: string): Promise<Conversation> {
    return this.conversationModel.findById(id).exec();
  }

  update(id: string, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    return this.conversationModel.findByIdAndUpdate(id, updateConversationDto, { new: true }).exec();
  }

  remove(id: string): Promise<Conversation> {
    return this.conversationModel.findByIdAndDelete(id).exec();
  }
}
