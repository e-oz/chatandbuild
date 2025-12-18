import type { WorkspaceId } from './workspace';

export interface WorkspaceResult {
  readonly _id: WorkspaceId;
  readonly name: string;
  readonly description?: string;
  readonly type: 'public' | 'private';
  readonly createdAt: string;
}
