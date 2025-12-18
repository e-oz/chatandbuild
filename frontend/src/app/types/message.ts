import type { Tagged } from 'type-fest';
import type { FileMetadata } from './file-metadata';
import type { Reaction } from './reaction';
import type { User } from './user';
import type { WorkspaceId } from './workspace';

export type MessageId = Tagged<string, 'MessageId'>;

export interface Message {
  readonly _id: MessageId;
  readonly workspaceId: WorkspaceId;
  readonly content: string;
  readonly author: User;
  readonly type: 'text' | 'file' | 'system';
  readonly isEdited?: boolean;
  readonly metadata?: FileMetadata;
  readonly reactions?: Array<Reaction>;
  readonly createdAt: string;
  readonly editedAt?: string;
  readonly updatedAt: string;
}
