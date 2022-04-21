import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Conversation, ConversationDocument } from '../conversations/conversation.schema';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { LoggerWinston } from '../logger/logger-winston.service';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly conversationsService: ConversationsService,
    private readonly logger: LoggerWinston,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  private async checkUserAccess(id: string, client: Socket): Promise<void> {
    const message = await this.messageModel.findById(id).exec();

    if (message.user.toString() !== client.data.userID && message.conversation.toString() !== client.data.conversationID) {
      this.logger.warn(`User error: forbidden access for user with id=${client.data.userID} to message with id=${id}`, 'MessagesService');
      throw new WsException('Forbidden!');
    }
  }

  async create(createMessageDto: CreateMessageDto, client: Socket): Promise<Message> {
    const { text } = createMessageDto;
    const { conversationID, userID } = client.data;
    const createdMessage = new this.messageModel({ text, user: userID, conversation: conversationID });
    const message = await createdMessage.save();

    // await this.conversationModel.findByIdAndUpdate(conversationID, { unreadMessageFromUser: userID }).exec();

    const conversation = await this.conversationsService.findOne(conversationID);
    conversation.messages.push(message);
    conversation.unreadMessageFromUser = userID;
    await this.conversationsService.update(conversationID, conversation);

    // client.to(conversationID).emit('unread', { unread: true });
    client.to(conversationID).emit('newMessage', { message });

    return message;
  }

  async findAll(client: Socket): Promise<Message[]> {
    const { conversationID, userID } = client.data;
    const conversation = await this.conversationsService.findOne(conversationID);
    if (!conversation.unreadMessageFromUser && conversation.unreadMessageFromUser !== userID) {
      await this.conversationModel.findByIdAndUpdate(conversationID, { unreadMessageFromUser: null }).exec();
    }

    // return this.messageModel.find({ conversation: conversationID }).exec();

    return conversation.messages;
  }

  async findOne(id: string, client: Socket): Promise<Message> {
    await this.checkUserAccess(id, client);
    return this.messageModel.findById(id).exec();
  }

  async update(updateMessageDto: UpdateMessageDto, client: Socket): Promise<Message> {
    const { _id: id, ...updateMessageData } = updateMessageDto;
    await this.checkUserAccess(id, client);

    return this.messageModel.findByIdAndUpdate(id, updateMessageData, { new: true }).exec();
  }

  async remove(id: string, client: Socket): Promise<Message> {
    await this.checkUserAccess(id, client);
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
