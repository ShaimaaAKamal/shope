import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../../Services/Category/category.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { Category } from '../../../Interfaces/category';
import { ServiceInterface } from '../../../Interfaces/service-interface';
import { CommonService } from '../../../Services/CommonService/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  __CategoryService = inject(CategoryService);
  private __CommonService=inject(CommonService);
  private route=inject(ActivatedRoute);
  page=this.__CommonService.page;
  addCategory = signal(false);
  editCategory=signal(false);
  categories = this.__CategoryService.categories;
  del: boolean = false;
  category!:Category;
  __LanguageService = inject(LanguageService);
  isRtl=this.__LanguageService.rtlClassSignal;
  servicesList:ServiceInterface[]=[]

  constructor(){
    this.page.set('Categories');
  }
  ngOnInit(): void {
    this.__CategoryService.paginationCtx.getStore('Categories')?.initFromQueryParams(this.route);
  }
  addNew(event: any) {
    this.addCategory.set(true);
  }
  deleteSelected(_del: boolean): void {
    // this.__CustomerService.deleteCustomers(this.checkeCustomers).subscribe();
}
getEditCategoryInfo(category:Category){
  this.category=category;
  this.editCategory.set(true);
}

closeCreate(category:Category){
  this.addCategory.set(false);
}
closeEdit(category:Category){
  this.editCategory.set(false);
}
ngOnDestroy() {
  this.__CategoryService.paginationCtx.getStore('Categories')?.resetPage();
}
}
