import { Injectable, WritableSignal } from '@angular/core';
import { PaginationStore } from '../../shared/stores/pagination-store.store';
import { map, Observable } from 'rxjs';

interface Filter {
  operation: number;
  propertyName: string;
  propertyValue: string;
}

interface Sort {
  propertyName: string;
  descending: boolean;
}

 interface FetchRequestBody {

  filters: Filter[];
  sorts: Sort[];
  pagingModel: {
    index: number;
    length: number;
    all: boolean;
  };
  properties?: string;
}

export type FetchEntityFn<T> = (body: FetchRequestBody) => Observable<{ data: T[]; totalCount: number }>;

@Injectable({
  providedIn: 'root'
})
export class PaginationContextService {

  private storeMap = new Map<string, PaginationStore<any>>();
  defaultSorts :Sort[] = [
    { propertyName: 'InsertedDate', descending: true }
  ];
  constructor() {}

  registerEntity<T>(
    key: string,
    getFn: (body?: any) => Observable<{ data: T[]; totalCount: number }>,
    signal: WritableSignal<T[]>,
    handleLoadingFn?: (data: T[]) => T[]
  ) {
    const fetcher = handleLoadingFn
      ? this.createPaginatedFetcher<T>(getFn, handleLoadingFn)
      : this.createPaginatedFetcher<T>(getFn);

    const store = new PaginationStore<T>(fetcher, signal);
    this.storeMap.set(key, store);
  }

  getSearchFn<T>(
    key: string,
    property: string,
    getFn: (body?: any) => Observable<{ data: T[]; totalCount: number }>
  ): (searchKey: string) => (page: number, size: number) => Observable<{ data: T[]; totalCount: number }> {
    return (searchKey: string) => {
      const filters = [{ operation: 3, propertyName: property, propertyValue: searchKey }];
      return this.createSearchFn(filters, (body) => getFn(body));
    };
  }

  getStore<T>(key: string): PaginationStore<T> | undefined {
    return this.storeMap.get(key);
  }


  //Pagination function
  private createPagingModel(page: number, size: number) {
  return {
    index: page - 1,
    length: size,
    all: false,
  };
}


private createFetchBody({
  filters = [] as Filter[],
  sorts = this.defaultSorts,
  page = 1,
  size = 10,
  properties = ''
}): any {
  return {
    filters,
    sorts,
    pagingModel: this.createPagingModel(page, size),
    properties
  };
}

private createPaginatedFetcher<T>(
  fetchFn: FetchEntityFn<T>,
  processData?: (data: T[]) => T[]
): (page: number, size: number) => Observable<{ data: T[]; totalCount: number }> {
  return (page: number, size: number) => {
    const body = this.createFetchBody({ page, size });

    return fetchFn(body).pipe(
      map(result => ({
        ...result,
        data: processData ? processData(result.data) : result.data
      }))
    );
  };
}

private createSearchFn<T>(
  filters: any[],
  fetchFn: (body: any) => Observable<{ data: T[] }>
): (page: number, size: number) => Observable<{ data: T[]; totalCount: number }> {
  return (page: number, size: number) => {
    const body = this.createFetchBody({ filters, page, size });
    return fetchFn(body).pipe(
      map(response => ({
        data: response.data as T[],
        totalCount: (response as any).totalCount ?? response.data.length
      }))
    );
  };
}


}
