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
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  findAll(): Promise<Message[]> {
    return this.messageModel.find({}).exec();
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
