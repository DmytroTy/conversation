import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Conversation } from '../conversations/conversation.schema';
import { ConversationsService } from '../conversations/conversations.service';
import { MockConversationModel } from '../conversations/testing/mock.conversation.model';
import { LoggerWinston } from '../logger/logger-winston.service';
import { MockUserModel } from '../users/testing/mock.user.model';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let messagesService: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ConversationsService,
        LoggerWinston,
        MessagesService,
        UsersService,
        {
          provide: getModelToken(Conversation.name),
          useClass: MockConversationModel,
        },
        {
          provide: getModelToken(User.name),
          useClass: MockUserModel,
        },
      ],
    }).compile();

    messagesService = module.get<MessagesService>(MessagesService);
  });

  it('MessagesService should be defined', () => {
    expect(messagesService).toBeDefined();
  });
});
