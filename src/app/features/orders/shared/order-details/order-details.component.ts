import { Component, Input, Signal, ViewChild } from '@angular/core';
import { Product } from '../../../../Interfaces/product';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Customer } from '../../../../Interfaces/customer';
import { CustomerService } from '../../../../Services/Customer/customer.service';
import { Order } from '../../../../Interfaces/order';
import { ProductService } from '../../../../Services/Product/product.service';
import { OrderService } from '../../../../Services/order/order.service';
import { LanguageService } from '../../../../Services/Language/language.service';

interface OrderInputs {
  order: Order | null;
  selectedCustomer: Customer;
}
@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})

export class OrderDetailsComponent {
@ViewChild('searchInputByName') searchInputByName!: InputComponent;
@ViewChild('searchInputByBarcode') searchInputByBarcode!: InputComponent;

@Input() OrderDetailsData: OrderInputs = {
  order: null,
  selectedCustomer: {
    id: -1,
    name: '',
    nameAr: ''
  }
};

isRtl!:Signal<boolean>;
customers!:Signal<Customer[]>;
searchItems:Product[]=[];
addNewCustomer:boolean=false;

constructor(private __CustomerService:CustomerService
  ,private __ProductsService:ProductService
  ,private __OrderService:OrderService
  ,private __LanguageService:LanguageService){
    this.isRtl=this.__LanguageService.rtlClassSignal;
  }

ngOnInit(): void {
 this.customers=this.__CustomerService.customers;
 if(this.OrderDetailsData.selectedCustomer) this.__OrderService.setInvoiveCustomer(this.OrderDetailsData.selectedCustomer);
}

selectedCustomerEvent(customer:Customer){
  this.OrderDetailsData.selectedCustomer=customer;
  this.__OrderService.setInvoiveCustomer(customer);
}

searchProductsByName($event:any){
const searchKey=$event.target.value;
 this.searchItems=this.__ProductsService.findProductByName(searchKey);
}
handleSearchByNameFocus(type:string){
  this.searchItems=type == 'focus' ?this.__ProductsService.products().slice(0, 10):[];
}

searchProductsByBarcode($event:any){
  const searchKey=$event.target.value;
  const filteredProducts:Product[]=this.__ProductsService.findProductByBarcode(searchKey);
  if(filteredProducts.length>0)
  {  this.addProductItem(filteredProducts[0]);
    this.searchInputByBarcode.value='';
  }
}

selectItem(product:Product){
    this.addProductItem(product);
    this.searchInputByName.value = '';
    this.searchItems=[];
}

private addProductItem(proudct:Product){
let products:Product[]=this.__OrderService.orderProducts();
 let existingProductIndex:number = products.findIndex(p => p.id === proudct.id);
if (existingProductIndex > -1) {
  // products[existingProductIndex].quantity =( Number(products[existingProductIndex].quantity) +1).toString();
    products[existingProductIndex].quantity =((products[existingProductIndex].quantity) +1);

} else {
  // proudct.quantity = '1';
    proudct.quantity = 1;

  products.push(proudct);
}
    this.__OrderService.UpdateProducts(products);
}

showAddNewCustomerForm(){
  this.addNewCustomer=true;
}
closeCustomerForm(){
    this.addNewCustomer=false ;
}
clearCustomerFn(){
  this.OrderDetailsData.selectedCustomer={name:'',nameAr:'' , id:-1};
  this.__OrderService.setInvoiveCustomer(this.OrderDetailsData.selectedCustomer);
}
}
