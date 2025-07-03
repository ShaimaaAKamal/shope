import { Component, effect, EventEmitter, inject, input, Input, Output, signal, Signal, SimpleChanges } from '@angular/core';
import { ServiceInterface } from '../../../Interfaces/service-interface';
import { PaginationStore } from '../../stores/pagination-store.store';
import { CategoryService } from '../../../Services/Category/category.service';
import { ProductService } from '../../../Services/Product/product.service';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { OrderService } from '../../../Services/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../Services/CommonService/common.service';

interface LayoutInterface {
  route: string;
  items: any[];
  sortKey: string;
  header: string;
  subTitle: string;
  btnName: string;
  columns: any[];
  serviceType: string;
  servicesList:ServiceInterface[];
  page:string
}
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
@Input() LayoutComponentDate:LayoutInterface={
  route: '',
  items: [],
  sortKey: '',
  header: '',
  subTitle: '',
  btnName: '',
  columns: [],
  serviceType: '',
  servicesList:[],
  page:'Products'
};
@Input() close:boolean=false;


@Output() addNewVar=new EventEmitter<boolean>();
@Output() deleteSelected=new EventEmitter<boolean>();
@Output() serviceSelected = new EventEmitter<string>();
@Output() displayDir=new EventEmitter<string>();
isFilterVisible = false;

noItems!:boolean;
private readonly categoryService = inject(CategoryService);
private readonly productService = inject(ProductService);
private readonly customerService = inject(CustomerService);
private readonly orderService = inject(OrderService);
private readonly commonService = inject(CommonService);

private route=inject(ActivatedRoute);

paginationStore?: PaginationStore<any>;
constructor(){
  effect(() => {
       const page=this.commonService.page();
       this.paginationStore = this.getPaginationStore(page);

  });
}
ngOnInit(): void {
  this.noItems=this.LayoutComponentDate.items.length == 0;
}

ngOnChanges(changes: SimpleChanges): void {
 if(changes['LayoutComponentDate'])   this.noItems=this.LayoutComponentDate.items.length == 0;
if(changes['close'] && this.close)   {this.hideFilterOptions()}

}
setCurrentPage(page:number){
  this.paginationStore?.goToPage(page);
}
getPaginationStore(type: string | null): PaginationStore<any> | undefined {
  switch (type) {
    case 'Products':
      return this.productService.pagination;
    case 'Categories':
      return this.categoryService.pagination;
    case 'Customers':
      return this.customerService.pagination;
    case 'Variants':
      return this.productService.variantLookMasterPagination;
      case 'Variant Types':
        return this.productService.variantTypePagination;
    default:
      return undefined;
  }
}


handleDispalyedItems(displayedItems:any[]){
  this.LayoutComponentDate.items=[...displayedItems];
}
handleDelete(del:boolean){
  this.deleteSelected.emit(del);
}

addNew(value:boolean){
  if(value)
  {
    this.noItems=false;
   this.addNewVar.emit(value);
  }
}
handleServiceAction(action:any){
 this.serviceSelected.emit(action);
}
handleDisplayDir(event:string){
this.displayDir.emit(event);
}

showFilterOptions() {
  this.isFilterVisible = true;
}

hideFilterOptions() {
  this.isFilterVisible = false;
}

}
