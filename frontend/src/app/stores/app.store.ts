import { inject, Injectable, signal } from '@angular/core';
import { createEffect } from 'ngx-collection';
import { catchError, EMPTY, exhaustMap, finalize, of, switchMap, tap, throwError } from 'rxjs';
import { WorkspaceService } from '../services/workspace.service';
import type { Workspace } from '../types/workspace';

@Injectable({ providedIn: 'root' })
export class AppStore {
  readonly #currentWorkspace = signal<Workspace | undefined>(undefined);
  private readonly workspaceSrv = inject(WorkspaceService);
  readonly #isLoadingInitialWorkspace = signal(false);

  public readonly currentWorkspace = this.#currentWorkspace.asReadonly();
  public readonly isLoadingInitialWorkspace = this.#isLoadingInitialWorkspace.asReadonly();

  public setWorkspace(workspace: Workspace) {
    this.#currentWorkspace.set(workspace);
  }

  constructor() {
    this.setInitialWorkspaceId();
  }

  private readonly setInitialWorkspaceId = createEffect(_ => _.pipe(
    exhaustMap(() => {
      this.#isLoadingInitialWorkspace.set(true);
      return this.workspaceSrv.getAllWorkspaces().pipe(
        switchMap((response) => {
          if (!response?.success || !response.data?.length) {
            return throwError(() => 'Failed to fetch workspaces');
          }

          return of(response.data);
        }),
        tap((workspaces) => {
          if (workspaces.length) {
            const nonEmptyWorkspace = workspaces.find((w) => w.messageCount);
            this.setWorkspace(nonEmptyWorkspace || workspaces[0]);
          } else {
            console.error('Could not find initial workspace', workspaces);
          }
        }),
        finalize(() => this.#isLoadingInitialWorkspace.set(false)),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );
    }),
  ));
}
