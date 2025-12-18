import type { FileMetadata } from './file-metadata';
import type { User } from './user';

export interface SendMessageRequest {
  readonly content: string;
  readonly author: User;
  readonly type?: 'text' | 'file' | 'system';
  readonly metadata?: FileMetadata;
}
