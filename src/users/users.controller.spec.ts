import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockUserModel } from './testing/mock.user.model';
import { User } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useClass: MockUserModel,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('UsersController should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
