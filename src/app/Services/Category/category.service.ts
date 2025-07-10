import {  inject, Injectable, signal } from '@angular/core';
import { Category } from '../../Interfaces/category';
import { SharedService } from '../Shared/shared.service';
import { Observable, tap } from 'rxjs';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';
import { PaginationContextService } from '../PaginationContext/pagination-context.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
categories=signal<Category[]>([]);
paginationCtx=inject(PaginationContextService);
constructor(private __SharedService:SharedService) {
  this.paginationCtx.registerEntity<Category>(
    'Categories',
    this.getCategories.bind(this),
    this.categories
  );
}

// categoryAPiCall
getCategories(body?: any): Observable<{data:Category[],totalCount:number}> {
  return this.__HandleActualApiInvokeService.getEntities<Category>('GetCategories', 'categories',this.categories, body)
}

createCategoryApi(category: Category) {
  return this.__HandleActualApiInvokeService.createEntity<Category>(
    'CreateCategory',
    category,
    'Category',
    this.categories
  ).pipe(
    tap(value => {
      this.paginationCtx.getStore('Categories')?.refresh();
    })
  );
}

deleteCategory(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<Category>(
    'DeleteCategory',
    id,
    'category',
    this.categories,
  ).pipe(
    tap(value => {
      this.paginationCtx.getStore('Products')?.refresh();
    })
  );
}

updateCategory(category: Category) {
  return this.__HandleActualApiInvokeService.updateEntity<Category>(category, {
    apiMethod: 'UpdateCategory',
    signal: this.categories,
    entityName: 'Category',
    duplicateCheck: (cat) =>
      this.categories().some(v =>
        (v.nameEn === cat.nameEn || v.nameAr === cat.nameAr) && v.id !== cat.id
      )
  });
}

getCategoryByName(name: string) {
  const searchBody={sorts: [],
      filters: [
        {
          operation: 0,
          propertyName: "nameEn",
          propertyValue: name
        }
      ],
      pagingModel: {
        index: 0,
        length: 0,
        all: true
      },
      properties: ""
  }
  return this.__SharedService.getAllByPost('GetCategories','Categories',searchBody)
}


}
