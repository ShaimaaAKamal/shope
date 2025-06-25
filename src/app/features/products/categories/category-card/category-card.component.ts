import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LanguageService } from '../../../../Services/Language/language.service';
import { Category } from '../../../../Interfaces/category';
import { CategoryService } from '../../../../Services/Category/category.service';

@Component({
  selector: 'app-category-card',
  standalone: false,
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
@Input() category:Category={} as Category;
private  __LanguageService = inject(LanguageService);
private  __CategoryService = inject(CategoryService);
isRtl=this.__LanguageService.rtlClassSignal;

@Output() editCategory=new EventEmitter<Category>();


editCategoryfN(category:Category){
   this.editCategory.emit(category);
}
deleteCategory(category:Category){
 this.__CategoryService.deleteCategory(category.id!).subscribe({})
}
}
