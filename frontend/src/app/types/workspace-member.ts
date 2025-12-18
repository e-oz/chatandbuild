import type { UserID } from './user';

export interface WorkspaceMember {
  readonly userId: UserID;
  readonly role: 'owner' | 'admin' | 'member';
  readonly joinedAt: Date;
}
