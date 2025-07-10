import { inject, Injectable, WritableSignal } from '@angular/core';
import { PaginationStore } from '../../shared/stores/pagination-store.store';
import { map, Observable } from 'rxjs';
import { Filter } from '../../Interfaces/filter';
import { Sort } from '../../Interfaces/sort';
import { CommonService } from '../CommonService/common.service';

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
  private __CommonService=inject(CommonService);
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

    const store = new PaginationStore<T>(fetcher,key,signal);
    this.storeMap.set(key, store);
  }

  getSearchFn<T>(
    key: string,
    property: string,
    getFn: (body?: any) => Observable<{ data: T[]; totalCount: number }>,
  ): (searchKey: string) => (page: number, size: number,filters:Filter[],sorts:Sort[]) => Observable<{ data: T[]; totalCount: number }> {
    return (searchKey: string) => {
      const filters=this.getStore(key)?.filters;
      const searchFilter: Filter = {
        operation: 3,
        propertyName: property,
        propertyValue: searchKey
      };

      const isDuplicate = filters?.some(f => f.propertyName === searchFilter.propertyName);

      const allFilters = filters?.length
        ? isDuplicate
          ? [...filters]
          : [...filters, searchFilter]
        : [searchFilter];

      return this.createSearchFn(allFilters, (body) => getFn(body));
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
  console.log('bodyFilter',filters);
  return {
    filters,
    sorts: sorts.length == 0 ? this.defaultSorts : sorts ,
    pagingModel: this.createPagingModel(page, size),
    properties
  };
}

private createPaginatedFetcher<T>(
  fetchFn: FetchEntityFn<T>,
  processData?: (data: T[]) => T[]
): (page: number, size: number,filters:Filter[],sorts:Sort[]) => Observable<{ data: T[]; totalCount: number }> {
  return (page: number, size: number,filters:Filter[],sorts:Sort[]) => {
    const body = this.createFetchBody({ page, size,filters,sorts });

    return fetchFn(body).pipe(
      map(result => ({
        ...result,
        data: processData ? processData(result.data) : result.data
      }))
    );
  };
}

private createSearchFn<T>(
  enterfilters: any[],
  fetchFn: (body: any) => Observable<{ data: T[] }>
): (page: number, size: number,filters:Filter[],sorts:Sort[]) => Observable<{ data: T[]; totalCount: number }> {
  return (page: number, size: number,filters:Filter[],sorts:Sort[]) => {
    const body = this.createFetchBody({
      filters:enterfilters
      , page, size });
    return fetchFn(body).pipe(
      map(response => ({
        data: response.data as T[],
        totalCount: (response as any).totalCount ?? response.data.length
      }))
    );
  };
}

}
