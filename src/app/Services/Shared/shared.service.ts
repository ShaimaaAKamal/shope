import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
import { ApiConfigService } from '../apiConfigService/api-config-service.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(
    private http: HttpClient,
    private __ApiConfigService: ApiConfigService,
    private __ToastingMessagesService: ToastingMessagesService
  ) {}

  private handleError(operation: string, entityName: string = 'item', error: any): Observable<never> {
    this.__ToastingMessagesService.showToast(`Failed to ${operation} ${entityName}`, 'error');
    return throwError(() => error);
  }

  getAll<T>(endpointKey: string, entityName: string = 'item'): Observable<T[]> {
    const url = this.__ApiConfigService.getEndpoint(endpointKey);
    return this.http.get<T[]>(url).pipe(
      catchError(err => this.handleError('fetch', entityName, err))
    );
  }

  getById<T>(endpointKey: string, id: number | string, entityName: string = 'item'): Observable<T> {
    const url = `${this.__ApiConfigService.getEndpoint(endpointKey)}/${id}`;
    return this.http.get<T>(url).pipe(
      catchError(err => this.handleError('fetch', entityName, err))
    );
  }

  create<T>(endpointKey: string, data: T, entityName: string = 'item'): Observable<T> {
    const url = this.__ApiConfigService.getEndpoint(endpointKey);
    return this.http.post<T>(url, data).pipe(
      tap(() => this.__ToastingMessagesService.showToast(`${entityName} created successfully`, 'success')),
      catchError(err => this.handleError('create', entityName, err))
    );
  }

  update<T>(endpointKey: string, id: number | string, data: T, entityName: string = 'item'): Observable<T> {
    const url = `${this.__ApiConfigService.getEndpoint(endpointKey)}/${id}`;
    return this.http.put<T>(url, data).pipe(
      tap(() => {this.__ToastingMessagesService.showToast(`${entityName} updated successfully`, 'success')}),
      catchError(err => this.handleError('update', entityName, err))
    );
  }

  delete<T>(endpointKey: string, id: number | string, entityName: string = 'item'): Observable<T> {
    const url = `${this.__ApiConfigService.getEndpoint(endpointKey)}/${id}`;
    return this.http.delete<T>(url).pipe(
      tap(() => this.__ToastingMessagesService.showToast(`${entityName} deleted successfully`, 'success')),
      catchError(err => this.handleError('delete', entityName, err))
    );
  }
}
