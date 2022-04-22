import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Conversation, ConversationSchema } from '../conversations/conversation.schema';
import { ConversationsModule } from '../conversations/conversations.module';
import { LoggerModule } from '../logger/logger.module';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    AuthModule,
    ConversationsModule,
    LoggerModule,
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
