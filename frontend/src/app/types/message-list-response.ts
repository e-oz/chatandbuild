import type { Message } from './message';

export interface MessageListResponse {
  readonly success: boolean;
  readonly count: number;
  readonly total: number;
  readonly page: number;
  readonly pages: number;
  readonly data: Message[];
}
