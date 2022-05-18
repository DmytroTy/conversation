import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerWinston } from '../logger/logger-winston.service';
import { MockUserModel } from '../users/testing/mock.user.model';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { Conversation } from './conversation.schema';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MockConversationModel } from './testing/mock.conversation.model';

describe('ConversationsController', () => {
  let conversationsController: ConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
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

    conversationsController = module.get<ConversationsController>(ConversationsController);
  });

  it('ConversationsController should be defined', () => {
    expect(conversationsController).toBeDefined();
  });
});
