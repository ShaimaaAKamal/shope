import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CategoryService } from '../../../../Services/Category/category.service';
import { Category } from '../../../../Interfaces/category';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
   __CategoryService=inject(CategoryService);
     @Output() createdCategory=new EventEmitter<Category>();

     @Input() CompoenentData={
        header:'Add Category',
        item:{} as Category,
        label:'Add Category'
     }

   onVariantCreated(data:any){
     this.createdCategory.emit(data);
   }

}
