import {  inject, Injectable, signal } from '@angular/core';
import { Category } from '../../Interfaces/category';
import { SharedService } from '../Shared/shared.service';
import { Observable, tap } from 'rxjs';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';
import { PaginationStore } from '../../shared/stores/pagination-store.store';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
  private commonService = inject(CommonService);
categories=signal<Category[]>([]);

// searchCategoryFn = (searchKey: string) => {
//   return (page: number, size: number) => {
//     const filters = [
//       {
//         operation: 3,
//         propertyName: 'nameEn',
//         propertyValue: searchKey
//       }
//     ];

//     const body = this.commonService.createFetchBody({ filters, page, size });

//     return this.getCategories(body)
//   };
// };

searchFn = (searchKey: string) => {
  const filters = [
    {
      operation: 3,
      propertyName: 'nameEn',
      propertyValue: searchKey
    },
    // add category-specific filters here if needed
  ];

  return this.commonService.createSearchFn(filters, (body) => this.getCategories(body));
};

fetchPaginatedCategories = this.commonService.createPaginatedFetcher<Category>(
      this.getCategories.bind(this),
    );

pagination = new PaginationStore<Category>(this.fetchPaginatedCategories,this.categories);
constructor(private __SharedService:SharedService) {}

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
      this.pagination.refresh();
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
      this.pagination.refresh();
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
validateCategoryInputs(nameEn: string, nameAr: string,id:number |null=null) {
  const normalizedName = nameEn.trim().toLowerCase();
  const normalizedArabicName = nameAr.trim().toLowerCase();

  if (!normalizedName) {
    return {
      message: 'Name is Required',
      status: false,
      errorType: 'missing_Name'
    };
  }

  if (!normalizedArabicName) {
    return {
      message: 'Arabic Name is Required',
      status: false,
      errorType: 'missing_Arabic_Name'
    };
  }

  const categories = this.categories();

  const duplicateExists = id == null
    ? categories.some(
        (category) =>
          category.nameEn.toLowerCase() === normalizedName ||
          category.nameAr.toLowerCase() === normalizedArabicName
      )
    : categories.find(
        (category) =>
          (category.nameEn.toLowerCase() === normalizedName ||
           category.nameAr.toLowerCase() === normalizedArabicName) &&
          category.id !== id
      );

  if (duplicateExists) {
    return {
      message: 'Category already exists',
      status: false,
      errorType: 'already_Exist'
    };
  }

  // const exists = this.categories().some(
  //   (category: Category) =>
  //     category.nameEn.toLowerCase() === normalizedName ||
  //     category.nameAr === normalizedArabicName
  // );

  // if (exists) {
  //   return {
  //     message: 'Category already exists',
  //     status: false,
  //     errorType: 'already_Exist'
  //   };
  // }

  return { status: true };
}
}
