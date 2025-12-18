import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Collection, createEffect } from 'ngx-collection';
import { catchError, distinctUntilChanged, EMPTY, exhaustMap, filter, map, of, shareReplay, switchMap, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import type { Message } from '../types/message';
import type { SendMessageRequest } from '../types/send-message-request';
import type { WorkspaceId } from '../types/workspace';
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

  public readonly addMessage = createEffect<{ workspaceId: WorkspaceId; request: SendMessageRequest }>((_, callbacks) => _.pipe(
    exhaustMap((params) => this.collection.create({
      request: this.messagesSrv.sendMessage(params.workspaceId, params.request).pipe(
        exhaustMap((response) => {
          if (!response?.success || !response.data) {
            return throwError(() => 'Failed to send message');
          } else {
            return of(response.data);
          }
        })
      ),
      onSuccess: callbacks.success,
      onError: callbacks.error,
    })),
    catchError(() => EMPTY)
  ));
}
