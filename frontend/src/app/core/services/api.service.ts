import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1';

  getSessions(page: number, limit: number, project?: string): Observable<any> {
    let url = `${this.baseUrl}/sessions?page=${page}&limit=${limit}`;
    if (project) {
      url += `&project=${encodeURIComponent(project)}`;
    }
    return this.http.get(url);
  }

  getProjectDetails(project: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/sessions/project-details?project=${encodeURIComponent(project)}`);
  }

  searchSessions(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/sessions/search?q=${encodeURIComponent(query)}`);
  }

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sessions/projects`);
  }

  getTelemetryStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/telemetry/stats`);
  }

  getDatabasePath(): Observable<any> {
    return this.http.get(`${this.baseUrl}/settings/database-path`);
  }

  updateDatabasePath(dbPath: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/settings/database-path`, { path: dbPath });
  }

  browseDirectory(path?: string): Observable<any> {
    const url = path ? `${this.baseUrl}/settings/explorer?path=${encodeURIComponent(path)}` : `${this.baseUrl}/settings/explorer`;
    return this.http.get(url);
  }
}
