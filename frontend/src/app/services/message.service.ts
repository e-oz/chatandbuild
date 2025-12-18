import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Message } from '../types/message';
import type { MessageListResponse } from '../types/message-list-response';
import type { SendMessageRequest } from '../types/send-message-request';


@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private readonly apiUrl = '/api';
    private readonly http = inject(HttpClient);

    getWorkspaceMessages(workspaceId: string, params?: {
        page?: number;
        limit?: number;
        before?: string;
        after?: string;
    }): Observable<MessageListResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key as keyof typeof params] !== undefined) {
                    httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
                }
            });
        }
        return this.http.get<MessageListResponse>(`${this.apiUrl}/workspaces/${workspaceId}/messages`, { params: httpParams });
    }

    sendMessage(workspaceId: string, request: SendMessageRequest): Observable<{ success: boolean; data: Message }> {
        return this.http.post<{ success: boolean; data: Message }>(`${this.apiUrl}/workspaces/${workspaceId}/messages`, request);
    }

    updateMessage(id: string, content: string): Observable<{ success: boolean; data: Message }> {
        return this.http.put<{ success: boolean; data: Message }>(`${this.apiUrl}/messages/${id}`, { content });
    }

    deleteMessage(id: string): Observable<{ success: boolean; data: {} }> {
        return this.http.delete<{ success: boolean; data: {} }>(`${this.apiUrl}/messages/${id}`);
    }
}
