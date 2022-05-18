import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { Conversation } from './conversations/conversation.schema';
import { ConversationsService } from './conversations/conversations.service';
import { MockConversationModel } from './conversations/testing/mock.conversation.model';
import { LoggerWinston } from './logger/logger-winston.service';
import { MockJwtService } from './testing/mock.jwt.service';
import { MockUserModel } from './users/testing/mock.user.model';
import { User } from './users/user.schema';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ConfigService,
        AuthService,
        ConversationsService,
        LoggerWinston,
        UsersService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
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

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
