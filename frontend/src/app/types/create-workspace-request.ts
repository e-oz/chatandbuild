export interface CreateWorkspaceRequest {
  readonly name: string;
  readonly description?: string;
  readonly type?: 'public' | 'private';
  readonly createdBy?: string;
}
