import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './message.schema';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Message> {
    return this.messagesService.remove(id);
  }
}
