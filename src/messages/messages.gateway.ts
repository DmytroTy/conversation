import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
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
  constructor(
    private authService: AuthService,
    private readonly messagesService: MessagesService,
  ) {}

  /* @WebSocketServer()
  server: Server; */

  async handleConnection(client: any) {
    const conversationID = client.handshake.query.conversationID;

    try {
      client.data.userID = await this.authService.authenticateUser(client.handshake.auth.token, conversationID);
      client.data.conversationID = conversationID;
    } catch (err) {
      return err;
    }

    client.join(conversationID);
  }

  @SubscribeMessage('createMessage')
  create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto, client);
  }

  @SubscribeMessage('getMessages')
  findAll(@ConnectedSocket() client: Socket): Promise<Message[]> {
    return this.messagesService.findAll(client);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto, @ConnectedSocket() client: Socket): Promise<Message> {
    return this.messagesService.update(updateMessageDto, client);
  }

  @SubscribeMessage('deleteMessage')
  remove(@MessageBody('_id') id: string, @ConnectedSocket() client: Socket): Promise<Message> {
    return this.messagesService.remove(id, client);
  }
}
