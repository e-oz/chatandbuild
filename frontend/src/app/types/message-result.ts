import type { MessageId } from './message';
import type { User } from './user';

export interface MessageResult {
  readonly _id: MessageId;
  content: string;
  author: User;
  type: 'text' | 'file' | 'system';
  createdAt: string;
}
