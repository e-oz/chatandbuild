import type { Tagged } from 'type-fest';

export type UserID = Tagged<string, 'UserId'>;

export interface User {
  readonly name: string;
  readonly userId?: UserID;
  readonly avatar?: string;
}
