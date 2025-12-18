import { inject, Injectable, signal } from '@angular/core';
import { createEffect } from 'ngx-collection';
import { catchError, EMPTY, exhaustMap, finalize, tap } from 'rxjs';
import { WorkspaceService } from '../services/workspace.service';
import type { CreateWorkspaceRequest } from '../types/create-workspace-request';
import { AppStore } from './app.store';

@Injectable({providedIn: 'root'})
export class WorkspacesStore {
  private readonly appStore = inject(AppStore);
  private readonly workspaceSrv = inject(WorkspaceService);
  readonly #isCreating = signal(false);

  public readonly isCreating = this.#isCreating.asReadonly();

  public readonly createWorkspace = createEffect<CreateWorkspaceRequest>((_, callbacks) => _.pipe(
    exhaustMap((request) => {
      this.#isCreating.set(true);
      return this.workspaceSrv.createWorkspace(request).pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.appStore.setWorkspace(response.data);
          }
        }),
        finalize(() => this.#isCreating.set(false))
      );
    }),
    catchError((e) => {
      callbacks.error(e);
      return EMPTY;
    })
  ));
}
