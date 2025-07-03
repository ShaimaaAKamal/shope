
import { Injectable, signal } from '@angular/core';
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
export class CommonService {


isCollapse=signal<boolean>(false);
page=signal<string>('');

  getItemsFromStorage<T = any>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : defaultValue;
}

  saveToStorage(key: string, data: any) {
      localStorage.setItem(key, JSON.stringify(data));
  }

updateItemInArray<T extends { name?: string; nameAr?: string }>(
  array: T[],
  matchFn: (item: T) => boolean,
  newValue: T,
): { updated: boolean; array: T[],message?:string } {
  let message;
  const index = array.findIndex(matchFn);
  const updated = index !== -1;

  if (updated) {
    let duplicateField: 'name' | 'nameAr' | null = null;

    const isDuplicate = array.some((item, i) => {
      if (i === index) return false;

      if (item.name && item.name === newValue.name) {
        duplicateField = 'name';
        return true;
      }

      if (item.nameAr && item.nameAr === newValue.nameAr) {
        duplicateField = 'nameAr';
        return true;
      }

      return false;
    });
    if (!isDuplicate) {
      array[index] = newValue;
    } else {
      if (duplicateField === 'nameAr') {
       message=('Duplicate_Arabic_Name');
      } else if (duplicateField === 'name') {
        message=('Duplicate_English_Name');
      }
      return { updated: false, array ,message:message};
    }
  }

  return { updated, array };
}

 checkDuplicateInArray<T extends { name?: string; nameAr?: string; nameEn?: string }>(
  array: T[],
  matchFn: (item: T) => boolean,
  newValue: T
): { isDuplicate: boolean; message?: string } {
  const index = array.findIndex(matchFn);
  if (index !== -1) {
    let duplicateField: 'name' | 'nameAr' | 'nameEn' | null = null;

    const isDuplicate = array.some((item, i) => {
      if (i === index) return false;

      if ((item.name && item.name === newValue.name) || (item.nameEn && item.nameEn === newValue.nameEn) ) {
        duplicateField = (item.name && item.name === newValue.name) ?'name':'nameEn' ;
        return true;
      }

      if (item.nameAr && item.nameAr === newValue.nameAr) {
        duplicateField = 'nameAr';
        return true;
      }

      return false;
    });

    if (isDuplicate) {
      const message =
        duplicateField === 'nameAr'
          ? 'Duplicate_Arabic_Name'
          : 'Duplicate_English_Name';
      return { isDuplicate: true, message };
    }
  }

  return { isDuplicate: false };
}
findItemInArray<T extends { name?: string,code?:string,nameEn?: string,id?:number , firstNameEn?:string }>(
  array: T[], matchFn: (item: T) => boolean) :{exists:boolean; ind: number; item:any }{
  const index = array.findIndex(matchFn);
  const exists = index !== -1;
  if(exists)
    return {exists:true,ind:index,item:array[index]}
  else return {exists:false, ind:index ,item:null }

}
controlPopScreen(ref: { togglePopScreen: (action: string) => void }, action: string = 'open'): void {
  ref?.togglePopScreen?.(action);
}

addOrReplaceItemById<T extends { id?: number | string }>(array: T[], newItem: T): T[] {
  const index = array.findIndex(item => item.id === newItem.id);
  const updated = [...array];

  if (index !== -1) {
    updated[index] = newItem;
  } else {
          updated.unshift(newItem);
   }
  return updated;
}


//Pagination function
 createPagingModel(page: number, size: number) {
  return {
    index: page - 1,
    length: size,
    all: false,
  };
}
defaultSorts :Sort[] = [
  { propertyName: 'InsertedDate', descending: true }
];

 createFetchBody({
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

createPaginatedFetcher<T>(
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

 createSearchFn<T>(
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
