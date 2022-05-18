import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WsException } from '@nestjs/websockets';
import { Conversation } from '../conversations/conversation.schema';
import { ConversationsService } from '../conversations/conversations.service';
import { MockConversationModel } from '../conversations/testing/mock.conversation.model';
import { LoggerWinston } from '../logger/logger-winston.service';
import { MockJwtService } from '../testing/mock.jwt.service';
import { MockUserModel } from '../users/testing/mock.user.model';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let conversationsService: ConversationsService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    authService = module.get<AuthService>(AuthService);
    conversationsService = module.get<ConversationsService>(ConversationsService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    usersService.create = jest.fn().mockReturnValue({
      _id: 1,
      name: 'test',
      email: 'test@test.com',
      password: '$2b$10$qJMKL4a8RkUB/hh2yK0ZFO0ZFzvlhEJDrd8FlCEeS1xnZIjvKjJku',
    });
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('a valid e-mail address and password have been passed - must return the user object', async () => {
      const email = 'test@test.com';
      const pass = 'test';
      expect(await authService.validateUser(email, pass)).toEqual({ _id: '1', name: 'test', email: 'test@test.com', myConversations: [] });
    });

    it('invalid e-mail address have been passed - must return null', async () => {
      const email = 'test@tt.com';
      const pass = 'test';
      expect(await authService.validateUser(email, pass)).toBeNull();
    });

    it('invalid password have been passed - must return null', async () => {
      const email = 'test@test.com';
      const pass = 'tst';
      expect(await authService.validateUser(email, pass)).toBeNull();
    });
  });

  describe('login', () => {
    it('user have been passed - must return a object with field "accessToken"', async () => {
      const user = { _id: 1, email: 'test@test.com' };
      expect(await authService.login(user)).toHaveProperty('accessToken');
    });
  });

  describe('register', () => {
    it('createUserDto have been passed - must return a user object', async () => {
      const createUserDto = { name: 'test', password: 'test', email: 'test@test.com' };
      expect(await authService.register({ ...createUserDto })).toHaveProperty('_id');
      expect(await authService.register({ ...createUserDto })).toHaveProperty('name', 'test');
      expect(await authService.register({ ...createUserDto })).toHaveProperty('email', 'test@test.com');
      expect(await authService.register({ ...createUserDto })).not.toHaveProperty('password');
    });
  });

  describe('authenticateUser', () => {
    it('a valid token and accessed conversationID have been passed - must return the user ID', async () => {
      const token = 'token';
      const conversationID = '1';
      jwtService.verify = jest.fn().mockReturnValueOnce({
        sub: '1',
        email: 'test@test.com',
      });
      conversationsService.findOne = jest.fn().mockReturnValueOnce({
        users: new Map([['1', {}]]),
      });

      expect(await authService.authenticateUser(token, conversationID)).toEqual('1');
    });

    it('invalid token have been passed - must throw an error', () => {
      const token = 'token';
      const conversationID = '1';
      jwtService.verify = () => { throw new Error('Expired') };
      conversationsService.findOne = jest.fn();
      const error = new WsException('Unauthorized: invalid JWT token!');

      expect(authService.authenticateUser(token, conversationID)).rejects.toThrowError(error);
    });

    it('not accessed conversationID have been passed - must throw an error', () => {
      const token = 'token';
      const conversationID = '0';
      jwtService.verify = jest.fn().mockReturnValueOnce({
        sub: '1',
        email: 'test@test.com',
      });
      conversationsService.findOne = jest.fn().mockReturnValueOnce({
        users: new Map([['10', {}]]),
      });
      const error = new WsException('Forbidden!');

      expect(authService.authenticateUser(token, conversationID)).rejects.toThrowError(error);
    });
  });
});
