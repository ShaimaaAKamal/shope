import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private config: any;
  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get('./assets/settings/api.json').pipe(
      tap((data) => {
        this.config = data;
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }

  get baseUrl(): string {
    return this.config?.API_BASE_URL || '';
  }

  getEndpoint(key: string): string {
    return this.baseUrl + (this.config?.endpoints?.[key] || '');
  }


}
