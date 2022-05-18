import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerWinston } from '../logger/logger-winston.service';
import { MockUserModel } from '../users/testing/mock.user.model';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { Conversation } from './conversation.schema';
import { ConversationsService } from './conversations.service';
import { MockConversationModel } from './testing/mock.conversation.model';

describe('ConversationsService', () => {
  let conversationsService: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ConversationsService,
        LoggerWinston,
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

    conversationsService = module.get<ConversationsService>(ConversationsService);
  });

  it('ConversationsService should be defined', () => {
    expect(conversationsService).toBeDefined();
  });
});
