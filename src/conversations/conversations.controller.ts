import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationsAccessGuard } from './api/middleware/conversations-access.guard';
import { Conversation } from './conversation.schema';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto, @Req() req): Promise<Conversation> {
    return this.conversationsService.create(createConversationDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req): Promise<(Conversation | string)[]> {
    return this.conversationsService.findAll(req.user.userId);
  }

  @UseGuards(ConversationsAccessGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Conversation> {
    return this.conversationsService.findOne(id);
  }

  @UseGuards(ConversationsAccessGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @UseGuards(ConversationsAccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req): Promise<Conversation> {
    return this.conversationsService.remove(id, req.user.userId);
  }
}
