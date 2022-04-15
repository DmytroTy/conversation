import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@Req() req): Promise<User> {
    return this.usersService.findOne(req.user.email);
  }

  @Patch('profile')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req): Promise<User> {
    return this.usersService.update(req.user.userId, updateUserDto);
  }
}
