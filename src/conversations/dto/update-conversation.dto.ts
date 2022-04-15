import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';

export class UpdateConversationDto extends PartialType(OmitType(CreateConversationDto, ['interlocutorId'] as const)) {}
