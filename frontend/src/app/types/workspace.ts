import type { Tagged } from 'type-fest';

export type WorkspaceId = Tagged<string, 'WorkspaceId'>;

export interface Workspace {
  readonly _id: WorkspaceId;
  readonly name: string;
  readonly description?: string;
  readonly type: 'public' | 'private';
  readonly createdBy?: string;
  readonly members?: Array<{
    userId: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
  }>;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}
