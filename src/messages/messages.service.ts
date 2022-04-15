import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Conversation, ConversationDocument } from '../conversations/conversation.schema';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    private authService: AuthService,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly conversationsService: ConversationsService,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto, client: Socket): Promise<Message> {
    const { conversationID, userID, text } = createMessageDto;
    const createdMessage = new this.messageModel({ text, user: userID, conversation: conversationID });
    const message = await createdMessage.save()

    await this.conversationModel.findByIdAndUpdate(conversationID, { unreadMessageFromUser: userID }).exec();

    // client.to(conversationID).emit('unread', { unread: true });
    client.to(conversationID).emit('newMessage', { message });

    return message;

    /* const conversation = await this.conversationsService.findOne(conversationID);
    conversation.messages.push({ text, user: userID });
    conversation.save();
    return  */
  }

  async findAllByConversationID(conversationID: string, authToken: string): Promise<Message[]> {
    const userID = await this.authService.authenticateUser(authToken, conversationID);
    const conversation = await this.conversationsService.findOne(conversationID);
    if (conversation.unreadMessageFromUser !== userID) {
      await this.conversationModel.findByIdAndUpdate(conversationID, { unreadMessageFromUser: null }).exec();
    }
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
