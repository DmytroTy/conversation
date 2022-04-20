import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerWinston } from '../../../logger/logger-winston.service';
import { Conversation, ConversationDocument } from '../../conversation.schema';

@Injectable()
export class ConversationsAccessGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerWinston,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let id, userId: string;
    const request = context.switchToHttp().getRequest();
    ({ params: { id }, user: { userId } } = request);
    const conversation = await this.conversationModel.findById(id).exec();

    const haveAccess = conversation.users && conversation.users.get(userId);
    if (!haveAccess) {
      this.logger.warn(`User error: user with id = ${userId} haven't access to conversation with id = ${id}`, 'ConversationsAccessGuard');
    }

    return !!haveAccess;
  }
}
