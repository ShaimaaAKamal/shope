import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const specialEntities = new Set(['Login', 'Change Password Data', 'Set Password']);

    if(entityName !== 'product' && entityName !== 'getUserByMail'){
      const message = specialEntities.has(entityName)
        ? `Failed to ${entityName}`
        : `Failed to ${operation} ${entityName}`;

      this.__ToastingMessagesService.showToast(message, 'error');
    }

    return throwError(() => error);
  }


  getAllByPost<T>(
    endpointKey: string,
    entityName: string = 'item',
    body: any = {
      sorts: [],
      filters: [],
      pagingModel: {
        index: 0,
        length: 10,
        all: false
      },
      properties: ''
    }
  ): Observable<{
    data: T[];
    statusCode: number;
    message: string | null;
    isSuccess: boolean;
    totalCount: number;
  }> {
    const url = this.__ApiConfigService.getEndpoint(endpointKey);

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json-patch+json'
    });

    return this.http.post<{
      data: T[];
      statusCode: number;
      message: string | null;
      isSuccess: boolean;
      totalCount: number;
    }>(url, body, { headers }).pipe(
      catchError(err => this.handleError('fetch', entityName, err))
    );
  }


  getByIdByPost<T>(
    endpointKey: string,
    id: number | string,
    entityName: string = 'item'
  ):  Observable<{
    data: T;
    statusCode: number;
    message: string | null;
    isSuccess: boolean;
    totalCount: number;
  }>  {
    const url = `${this.__ApiConfigService.getEndpoint(endpointKey)}?id=${id}`;

    const headers = new HttpHeaders({
      'accept': '*/*'
    });

    return this.http.post<{
      data: T;
      statusCode: number;
      message: string | null;
      isSuccess: boolean;
      totalCount: number;
    }>(url, null, { headers }).pipe(
      catchError(err => this.handleError('fetch', entityName, err))
    );
  }


  createByPost<T>(
    endpointKey: string,
    data: T,
    entityName: string = 'item'
  ): Observable<T> {
    const url = this.__ApiConfigService.getEndpoint(endpointKey);

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json-patch+json'
    });

    return this.http.post<T>(url, data, { headers }).pipe(
      tap(() => this.__ToastingMessagesService.showToast(`${entityName} created successfully`, 'success')),
      catchError(err => this.handleError('create', entityName, err))
    );
  }


  createListByPost<T>(
    endpointKey: string,
    data: T[],
    entityName: string = 'items'
  ): Observable<T[]> {
    const url = this.__ApiConfigService.getEndpoint(endpointKey);

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json-patch+json'
    });

    return this.http.post<T[]>(url, data, { headers }).pipe(
      tap(() =>
        this.__ToastingMessagesService.showToast(`${entityName} list created successfully`, 'success')
      ),
      catchError(err => this.handleError('bulk create', entityName, err))
    );
  }

  updateByPost<T>(
    endpointKey: string,
    data: T,
    entityName: string = 'item'
  ): Observable<T> {
    const url = this.__ApiConfigService.getEndpoint(endpointKey);

    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json-patch+json'
    });

    return this.http.put<T>(url, data, { headers }).pipe(
      tap(() => this.__ToastingMessagesService.showToast(`${entityName} updated successfully`, 'success')),
      catchError(err => this.handleError('update', entityName, err))
    );
  }

  deleteByPost<T>(endpointKey: string,id: number | string,entityName: string = 'item'): Observable<T> {
    const url = `${this.__ApiConfigService.getEndpoint(endpointKey)}?id=${id}`;
    const headers = new HttpHeaders({
      'accept': '*/*'
    });

    return this.http.delete<T>(url, { headers }).pipe(
      tap(() => this.__ToastingMessagesService.showToast(`${entityName} deleted successfully`, 'success')),
      catchError(err => this.handleError('delete', entityName, err))
    );
  }


}
