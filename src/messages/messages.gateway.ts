import { Req } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Request } from "express";
import { Socket } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './message.schema';
import { MessagesService } from './messages.service';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection {
  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: any /* , @Req() req: Request */) {
    client.join(client.handshake.query.conversationID);

    // client.handshake.headers.authorization;
    // client.handshake.query.conversationID;
  }

  @SubscribeMessage('createMessage')
  create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto, client);
  }

  @SubscribeMessage('getMessages')
  findAll(@MessageBody('conversationID') conversationID: string): Promise<Message[]> {
    return this.messagesService.findAllByConversation(conversationID);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messagesService.update(updateMessageDto);
  }

  @SubscribeMessage('deleteMessage')
  remove(@MessageBody('_id') id: string): Promise<Message> {
    return this.messagesService.remove(id);
  }
}
