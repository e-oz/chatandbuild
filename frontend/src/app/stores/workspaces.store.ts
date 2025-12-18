import { inject, Injectable } from '@angular/core';
import { WorkspaceService } from '../services/workspace.service';
import { AppStore } from './app.store';

@Injectable({providedIn: 'root'})
export class WorkspacesStore {
  private readonly appStore = inject(AppStore);
  private readonly workspaceSrv = inject(WorkspaceService);
}
