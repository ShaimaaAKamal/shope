import { effect, Injectable, signal } from '@angular/core';
import { Category } from '../../Interfaces/category';
import { SharedService } from '../Shared/shared.service';
import { tap } from 'rxjs';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

categories=signal<Category[]>([]);

constructor(private __SharedService:SharedService,private __CommonService:CommonService) {
  this.getCategories().subscribe({});
}

// categoryAPiCall
getCategories() {
  // this.loadingSignal.set(true);

  return this.__SharedService.getAllByPost<Category>('GetCategories', 'categories').pipe(
    tap({
      next: (data) =>{this.categories.set([...data.data  || []])},
      // complete: () => this.loadingSignal.set(false),
    })
  );
}
// getCategories() {
//   // this.loadingSignal.set(true);

//   return this.__SharedService.getAll<Category>('Categories', 'categories').pipe(
//     tap({
//       next: (data) => this.categories.set([...data]),
//       // complete: () => this.loadingSignal.set(false),
//     })
//   );
// }

// createCategoryApi(category: Category){
//   //  this.loadingSignal.set(true);
//    return this.__SharedService.create<Category>('Categories', category, 'Category').pipe(
//     tap({
//       next: (newCategory) => this.categories.update(categories => this.__CommonService.addOrReplaceItemById(categories, newCategory)),
//       // complete: () => this.loadingSignal.set(false),
//     })
//   );
//   }

createCategoryApi(category: Category){
  //  this.loadingSignal.set(true);
   return this.__SharedService.createByPost<Category>('CreateCategory', category, 'Category').pipe(
    tap({
      next: (newCategory) => this.categories.update(categories => this.__CommonService.addOrReplaceItemById(categories, newCategory)),
      // complete: () => this.loadingSignal.set(false),
    })
  );
  }
// deleteCategory(id: number) {
//     // this.loadingSignal.set(true);
//     return  this.__SharedService.delete<Category>('Categories', id, 'category').pipe(
//         tap({
//           next: () =>      this.categories.update(categories => categories.filter(p => p.id !== id)),
//           // complete: () => this.loadingSignal.set(false),
//         })
//       );
//   }

deleteCategory(id: number) {
  // this.loadingSignal.set(true);
  return  this.__SharedService.deleteByPost<Category>('DeleteCategory', id, 'category').pipe(
      tap({
        next: () =>      this.categories.update(categories => categories.filter(p => p.id !== id)),
        // complete: () => this.loadingSignal.set(false),
      })
    );
}

updateCategory(category: Category){
  if (!category.id) {
  throw new Error('Category ID is required for update.');
}

//  this.loadingSignal.set(true);
  const existingCategory = this.categories().find(v => (v.nameEn === category.nameEn ||  v.nameAr === category.nameAr) && v.id != category.id )
                  if (existingCategory) {
                    throw new Error(`Category with this name already exist.`);
                  }


                  if( !category.nameEn || !category.nameAr) {
                    throw new Error(`Category Name can't be empty.`);
                  }
  return this.__SharedService.updateByPost<Category>('UpdateCategory', category, 'category').pipe(
      tap({
        next: (updatedCategory) =>  {
              this.categories.update(categories =>
                  categories.map(v => (v.id === updatedCategory.id ? updatedCategory : v))
              );},
        // complete: () => this.loadingSignal.set(false),
      })
    );
}

createCategory(categoryName: string,categoryArabicName:string) {
  const normalizedName = categoryName.trim().toLowerCase();
  const normalizedArabicName = categoryArabicName.trim().toLowerCase();

  try {
    if(! normalizedName )
       return {
        message: 'Name is Required',
        status: false,
       errorType:"missing_Name"
      };
        if(! normalizedArabicName )
       return {
        message: 'Arabic Name is Required',
        status: false,
        errorType:"missing_Arabic_Name"
      };
    const exists = this.categories().some(
      (category: Category) => category.nameEn.toLowerCase() === normalizedName || category.nameAr === normalizedArabicName
    );

    if (exists) {
      return {
        message: 'Category already exists',
        status: false,
        errorType:"already_Exist"
      };
    }

    const newCategory: Category = {
      nameEn: categoryName.trim(),
      nameAr:categoryArabicName.trim(),
      isActive:true
    };
      this.createCategoryApi(newCategory).subscribe({});
    return {
      message: 'Category has been added successfully',
      catergory:newCategory,
      status: true,
    };
  } catch (error) {
    return {
      message: "Category can't be added",
      status: false,
    };
  }
}

getCategoryById(id: number) {
  return this.categories().find(category => category.id === id);
}
getCategoryByName(name: string) {
  return this.categories().find(category => category.nameEn === name);
}
}
