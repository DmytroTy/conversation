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
import { Message } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly conversationsService: ConversationsService,
    private readonly logger: LoggerWinston,
  ) {}

  private checkUserAccess(message: Message, userID: string): void {
    if (message.user.toString() !== userID) {
      this.logger.warn(`User error: forbidden access for user with id=${userID} to message with id=${message._id}`, 'MessagesService');
      throw new WsException('Forbidden!');
    }
  }

  async create(createMessageDto: CreateMessageDto, client: Socket): Promise<Message> {
    const { text } = createMessageDto;
    const { conversationID, userID } = client.data;
    const message = { text, user: userID };

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

    return conversation.messages;
  }

  async findOne(id: string, client: Socket): Promise<Message> {
    const conversation = await this.conversationsService.findOne(client.data.conversationID);
    const message = conversation.messages.find(mesg => (mesg._id.toString() === id));
    return message;
  }

  async update(updateMessageDto: UpdateMessageDto, client: Socket): Promise<Message> {
    const conversation = await this.conversationsService.findOne(client.data.conversationID);
    const message = conversation.messages.find(mesg => {
      if (mesg._id.toString() === updateMessageDto._id) {
        this.checkUserAccess(mesg, client.data.userID);
        mesg = { ...mesg, ...updateMessageDto };
        return true;
      }
      return false;
    });
    await this.conversationsService.update(client.data.conversationID, conversation);
    return message;
  }

  async remove(id: string, client: Socket): Promise<boolean> {
    const conversation = await this.conversationsService.findOne(client.data.conversationID);
    conversation.messages = conversation.messages.filter(
      mesg => (mesg._id.toString() !== id) || (mesg.user.toString() !== client.data.userID)
    );
    await this.conversationsService.update(client.data.conversationID, conversation);
    return true;
  }
}
