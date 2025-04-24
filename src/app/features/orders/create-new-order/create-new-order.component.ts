import { Component, ViewChild } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Customer } from '../../../Interfaces/customer';
import { Product } from '../../../Interfaces/product';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { ProductService } from '../../../Services/Product/product.service';
import { OrderService } from '../../../Services/order/order.service';

@Component({
  selector: 'app-create-new-order',
  standalone: false,
  templateUrl: './create-new-order.component.html',
  styleUrl: './create-new-order.component.scss'
})
export class CreateNewOrderComponent {
@ViewChild('searchInputByName') searchInputByName!: InputComponent;
@ViewChild('searchInputByBarcode') searchInputByBarcode!: InputComponent;

customers!:Customer[];
selectedCustomer:Customer={name:'' , id:-1};
searchItems:Product[]=[];

constructor(private __CustomerService:CustomerService
  ,private __ProductsService:ProductService
  ,private __OrderService:OrderService){}

ngOnInit(): void {
 this.customers=this.__CustomerService.customers();
}
selectedCustomerEvent(customer:Customer){
  this.selectedCustomer=customer;
  this.__OrderService.setInvoiveCustomer(customer);
}
searchProductsByName($event:any){
const searchKey=$event.target.value;
 this.searchItems=this.__ProductsService.findProductByName(searchKey);
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
  products[existingProductIndex].quantity =( Number(products[existingProductIndex].quantity) +1).toString();
} else {
  proudct.quantity = '1';
  products.push(proudct);
}
    this.__OrderService.UpdateProducts(products);

}
}
