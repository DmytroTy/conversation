import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
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
    private readonly messagesService: MessagesService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: any) {
    const conversationID = client.handshake.query.conversationID;

    try {
      await this.authService.authenticateUser(client.handshake.auth.token, conversationID);
    } catch (err) {
      return err;
    }

    client.join(conversationID);

    // client.handshake.headers.authorization;
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
