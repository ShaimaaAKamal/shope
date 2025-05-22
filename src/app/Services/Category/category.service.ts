import { Injectable, signal } from '@angular/core';
import { Category } from '../../Interfaces/category';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

categories=signal<Category[]>([]);

constructor(private __CommonService:CommonService) {
  this.categories.set(this.__CommonService.getItemsFromStorage<Category[]>('categories',[]));
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
      (category: Category) => category.name.toLowerCase() === normalizedName || category.nameAr === normalizedArabicName
    );

    if (exists) {
      return {
        message: 'Category already exists',
        status: false,
        errorType:"already_Exist"
      };
    }

    const newCategory: Category = {
      // id: this.categories().length + 1,
      id: this.__CommonService.getId(),
      name: categoryName.trim(),
      nameAr:categoryArabicName.trim()
    };

    const updatedCategories = [...this.categories(), newCategory];
    this.categories.set(updatedCategories);
    this.__CommonService.saveToStorage('categories', updatedCategories);

    return {
      message: 'Category has been added successfully',
      catergory:newCategory,
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Category can't be added",
      status: false,
    };
  }
}


}
