import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Collection } from 'ngx-collection';
import { distinctUntilChanged, filter, map, of, shareReplay, switchMap, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import type { Message } from '../types/message';
import { AppStore } from './app.store';

@Injectable({ providedIn: 'root' })
export class MessagesStore {
  private readonly appStore = inject(AppStore);
  private readonly workspace$ = toObservable(this.appStore.currentWorkspace);
  private readonly messagesSrv = inject(MessageService);

  private readonly workspaceId$ = this.workspace$.pipe(
    filter((v) => !!v),
    map((workspace) => workspace?._id),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public readonly collection = new Collection<Message>({
    comparatorFields: ['_id'],
    readFrom: {
      source: this.workspaceId$.pipe(
        switchMap((workspaceId) => this.messagesSrv.getWorkspaceMessages(workspaceId).pipe(
          switchMap((response) => {
            if (!response.success) {
              return throwError(() => 'Failed to fetch messages');
            }
            return of(response.data || []);
          })
        ))
      ),
    },
  });
}
