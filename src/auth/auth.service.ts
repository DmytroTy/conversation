import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    const isMatch = user ? await bcrypt.compare(pass, user.password) : false;

    if (isMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const pass = createUserDto.password;
    createUserDto.password = await bcrypt.hash(pass, saltOrRounds);

    let user: User;
    try {
      user = await this.usersService.create(createUserDto);
      delete user.password;
    } catch (err) {
      throw new InternalServerErrorException('Failed to create user account, please try again later.');
    }

    return user;
  }
}
