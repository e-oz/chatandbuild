import type { Workspace } from './workspace';

export interface WorkspaceListResponse {
  readonly success: boolean;
  readonly count: number;
  readonly total: number;
  readonly page: number;
  readonly pages: number;
  readonly data: Workspace[];
}
