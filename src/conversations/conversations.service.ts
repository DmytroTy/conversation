import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerWinston } from '../logger/logger-winston.service';
import { User, UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { Conversation, ConversationDocument } from './conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly logger: LoggerWinston,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createConversationDto: CreateConversationDto, userId: string): Promise<Conversation> {
    const { name, interlocutorId } = createConversationDto;

    const user = await this.usersService.findById(userId);
    const interlocutor = await this.usersService.findById(interlocutorId);

    const createdConversation = new this.conversationModel({
      name,
      users: new Map([[userId, interlocutor], [interlocutorId, user]]),
    });

    user.myConversations.push(createdConversation._id);
    await this.usersService.update(userId, user);

    interlocutor.myConversations.push(createdConversation._id);
    await this.usersService.update(interlocutorId, interlocutor);

    return createdConversation.save();
  }

  async findAll(userId: string): Promise<(Conversation | string)[]> {
    const user = await this.userModel.findById(userId).populate('myConversations', '_id name unreadMessageFromUser users').exec();
    return user.myConversations;
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(id).exec();

    if (!conversation) {
      this.logger.warn(`User error: Conversation with id = ${id} not found.`, 'ConversationsService');
      throw new NotFoundException();
    }

    return conversation;
  }

  update(id: string, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    return this.conversationModel.findByIdAndUpdate(id, updateConversationDto, { new: true }).exec();
  }

  async remove(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(id).exec();

    /* // Socket ?

    if (conversation.users.size < 2) {
      return this.conversationModel.findByIdAndDelete(id).exec();
    } */

    conversation.users.delete(userId);

    const user = await this.userModel.findById(userId).exec();
    user.myConversations = user.myConversations.filter(conversationId => conversationId.toString() !== id);
    await this.usersService.update(userId, user);

    return this.update(id, conversation);
  }
}
