import { Injectable, signal, WritableSignal } from '@angular/core';
import { SharedService } from '../Shared/shared.service';
import { catchError, finalize, forkJoin, map, Observable, of, tap } from 'rxjs';
import { CommonService } from '../CommonService/common.service';
import { Category } from '../../Interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class HandleActualApiInvokeService {
  private loadingSignal = signal<boolean>(false);
  loading = this.loadingSignal.asReadonly();

  constructor(private __SharedService:SharedService,private __CommonService:CommonService) {}



getEntities<T>(
  endpointKey: string,
  entityName: string,
  signal: WritableSignal<T[]>,
  body: any = {
    sorts: [   ],
    filters: [],
    pagingModel: {
      index: 0,
      length: 0,
      all: false
    },
    properties: ''
  }
): Observable<{
  data: T[];
  totalCount: number;
}> {
  return this.__SharedService.getAllByPost<T>(endpointKey, entityName, body).pipe(
    map(response => ({
      data: response.data || [],
      totalCount: response.totalCount ?? 0
    })),
    catchError(error => {
      console.error(`❌ Error fetching ${entityName}:`, error);
      return of({ data: [], totalCount: 0 });
    })
  );
}

getEntityById<T>(endpointKey: string, id: number, entityName: string): Observable<{
  data: T;
  statusCode: number;
  message: string | null;
  isSuccess: boolean;
  totalCount: number;
}>  {
  return this.__SharedService.getByIdByPost<T>(endpointKey, id, entityName);
}

deleteEntity<T>(
  endpointKey: string,
  id: number,
  entityName: string,
  signal: WritableSignal<T[]>,
  customAfterDelete?: (updatedList: T[]) => void
) {
  this.loadingSignal.set(true);

  return this.__SharedService.deleteByPost<T>(endpointKey, id, entityName).pipe(
    tap({
      next: () => {
        const updated = signal().filter(item => (item as any).id !== id);
        signal.set(updated);
        if (customAfterDelete) customAfterDelete(updated);
      },
      complete: () => this.loadingSignal.set(false)
    })
  );
}

deleteEntities<T>(
  endpointKey: string,
  ids: number[],
  entityName: string,
  signal: WritableSignal<T[]>,
  customAfterDelete?: (updatedList: T[]) => void
) {
  this.loadingSignal.set(true);

  const deleteRequests = ids.map(id =>
    this.__SharedService.deleteByPost<T>(endpointKey, id, entityName)
  );

  return forkJoin(deleteRequests).pipe(
    tap(() => {
      const updated = signal().filter(item => {
        const itemId = (item as any).id;
        return itemId !== undefined && !ids.includes(itemId);
      });

      signal.set(updated);

      if (customAfterDelete) customAfterDelete(updated);
    }),
    finalize(() => {
      this.loadingSignal.set(false);
    }),
    map(() => void 0)
  );
}

createEntity<T>(
  endpoint: string,
  entity: T,
  entityKey: string,
  signalToUpdate?: WritableSignal<T[]>,
  onSuccess?: (newEntity: T) => void,
  onError?: (error: any) => void
) {
  this.loadingSignal.set(true);

  return this.__SharedService.createByPost<T>(endpoint, entity, entityKey).pipe(
    tap({
      next: (response:any) => {
        const newEntity = response.data;

        if (entityKey.toLowerCase() === 'product' && onSuccess) {
          onSuccess(newEntity);
        } else if (signalToUpdate) {
          signalToUpdate.update(items =>
            this.__CommonService.addOrReplaceItemById(items, newEntity)
          );
        }
      },
      complete: () => this.loadingSignal.set(false),
    }),
    catchError(error => {
      console.error(`❌ ${endpoint} error:`, error);
      this.loadingSignal.set(false);
      onError?.(error);
      return of(null);
    })
  );
}
updateEntity<T extends { id?: number; category?: number }>(
  entity: T,
  options: {
    apiMethod: string;
    signal: WritableSignal<T[]>;
    entityName: string;
    duplicateCheck?: (item: T) => boolean;
    additionalValidation?: () => void;
  }
) {
  if (!entity.id) {
    throw new Error(`${options.entityName} ID is required for update.`);
  }

  if (options.duplicateCheck && options.duplicateCheck(entity)) {
    throw new Error(`${options.entityName} with this name already exists.`);
  }

  if (options.additionalValidation) {
    options.additionalValidation();
  }

  this.loadingSignal.set(true);
  return this.__SharedService.updateByPost<T>(
    options.apiMethod,
    entity,
    options.entityName.toLowerCase()
  ).pipe(
    tap({
      next: () => {
        if (options.entityName.toLowerCase() === 'product') {
          this.getEntityById<Category>('GetCategoryById', entity.category ?? 0, 'category').subscribe({
            next: (data) => {
              const { category, ...product } = entity;
              const newEntity = {
                categoryNameAr: data.data.nameAr,
                categoryNameEn: data.data.nameEn,
                ...product
              } as unknown as T;
              options.signal.update(list =>
                list.map(item => item.id === newEntity.id ? newEntity : item)
              );
            },
            complete: () => this.loadingSignal.set(false)
          });
        } else {
          options.signal.update(list =>
            list.map(item => item.id === entity.id ? entity : item)
          );
          this.loadingSignal.set(false);
        }
      }
    })
  );
}
}
