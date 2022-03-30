import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Conversation } from './conversation.schema';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto): Promise<Conversation> {
    return this.conversationsService.create(createConversationDto);
  }

  @Get()
  findAll(): Promise<Conversation[]> {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Conversation> {
    return this.conversationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Conversation> {
    return this.conversationsService.remove(id);
  }
}
