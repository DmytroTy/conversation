import { User } from '../users/user.schema';

export class Message {
  _id?: string;

  text: string;

  user: User;
}
