import { Component, EventEmitter, inject, Input, Output, output, ViewChild } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { PopScreenComponent } from '../../../../shared/components/pop-screen/pop-screen.component';
import { CategoryService } from '../../../../Services/Category/category.service';
import { Category } from '../../../../Interfaces/category';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  private __CategoryService=inject(CategoryService);
  @ViewChild('CategoryName') categoryNameInput!: InputComponent;
  @ViewChild('CategoryArabicName') CategoryArabicName!: InputComponent;
  @ViewChild('addCategory') addCategory!: PopScreenComponent;
  // @Output() createdCategory=new EventEmitter<void>();
  @Output() createdCategory=new EventEmitter<Category>();

  // @Input() category!:Category;
  @Input() CompoenentData={
     header:'Add Category',
     category:{} as Category
  }
  errorMessage: string = '';
errorArabicrMessage:string='';
ActiveDropDownSelection:string='Active'
readonly ActiveOptions = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
];

  ngAfterViewInit(): void {
    if(this.CompoenentData.category.id){
      this.fillInputFieldsFromCustomer(this.CompoenentData.category);
}
  }

fillInputFieldsFromCustomer(category: Category) {
  this.categoryNameInput.value=category.nameEn;
  this.CategoryArabicName.value=category.nameAr
  this.ActiveDropDownSelection=category.isActive ? 'Active' : "Inactive";
  }

changeSelect(event: any, key: 'isActive' | 'customerType') {
  if (key === 'isActive') this.ActiveDropDownSelection = event.title;
}
clearCategoryForm(){
  this.createdCategory.emit({} as Category);
}

createCategory(): void {
  const categoryName = this.categoryNameInput.value;
  const categoryArabicName = this.CategoryArabicName.value;
  const isActive=this.ActiveDropDownSelection == 'Active' ? true:false;
  const id=this.CompoenentData.category.id??null;
  const validation = this.__CategoryService.validateCategoryInputs(categoryName, categoryArabicName,id);
  if (!validation.status) {
    this.errorMessage =( validation.errorType == "missing_Name" || validation.errorType == "already_Exist" )?validation.message : '';
    this.errorArabicrMessage = validation.errorType == "missing_Arabic_Name" ?validation.message : '';
    return;
  }
  const newCategory: Category = {
    nameEn: categoryName.trim(),
    nameAr: categoryArabicName.trim(),
    isActive: isActive
  };

  if( id){
    this.__CategoryService.updateCategory({...newCategory, id}).subscribe({
      next:()=>         this.createdCategory.emit({...newCategory, id})
    })
  }
  else{
    this.__CategoryService.createCategoryApi(newCategory).subscribe({
      next:(data)=>{
               this.createdCategory.emit(data);
      }
    })
  }
}
}
