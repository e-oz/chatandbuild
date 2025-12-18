import type { UserID } from './user';

export interface Reaction {
  readonly emoji: string;
  readonly userId: UserID;
  readonly createdAt: Date;
}
