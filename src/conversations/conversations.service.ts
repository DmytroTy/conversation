import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Conversation, ConversationDocument } from './conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createConversationDto: CreateConversationDto, userId: string): Promise<Conversation> {
    const { name, interlocutorId } = createConversationDto;
    const createdConversation = new this.conversationModel({
      name,
      users: {},
    });

    const user = await this.usersService.findById(userId);
    createdConversation.users.set(interlocutorId, user);
    const interlocutor = await this.usersService.findById(interlocutorId);
    createdConversation.users.set(userId, interlocutor);

    user.myConversations.push(createdConversation._id);
    await this.usersService.update(userId, user);

    interlocutor.myConversations.push(createdConversation._id);
    await this.usersService.update(interlocutorId, interlocutor);

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
