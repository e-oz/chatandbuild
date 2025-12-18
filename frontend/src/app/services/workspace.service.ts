import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { CreateWorkspaceRequest } from '../types/create-workspace-request';
import type { Workspace } from '../types/workspace';
import type { WorkspaceListResponse } from '../types/workspace-list-response';

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
    private readonly apiUrl = '/api';
    private readonly http = inject(HttpClient);

    getAllWorkspaces(params?: {
        page?: number;
        limit?: number;
        type?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Observable<WorkspaceListResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key as keyof typeof params] !== undefined) {
                    httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
                }
            });
        }
        return this.http.get<WorkspaceListResponse>(`${this.apiUrl}/workspaces`, { params: httpParams });
    }

    getWorkspaceById(id: string): Observable<{ success: boolean; data: Workspace }> {
        return this.http.get<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces/${id}`);
    }

    createWorkspace(request: CreateWorkspaceRequest): Observable<{ success: boolean; data: Workspace }> {
        return this.http.post<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces`, request);
    }

    updateWorkspace(id: string, request: Partial<CreateWorkspaceRequest>): Observable<{ success: boolean; data: Workspace }> {
        return this.http.put<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces/${id}`, request);
    }

    deleteWorkspace(id: string): Observable<{ success: boolean; data: {} }> {
        return this.http.delete<{ success: boolean; data: {} }>(`${this.apiUrl}/workspaces/${id}`);
    }

    initializeProject(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/init`);
    }
}
