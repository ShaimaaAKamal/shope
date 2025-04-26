import { Component, Input, ViewChild } from '@angular/core';
import { Product } from '../../../../Interfaces/product';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Customer } from '../../../../Interfaces/customer';
import { CustomerService } from '../../../../Services/Customer/customer.service';
import { Order } from '../../../../Interfaces/order';
import { ProductService } from '../../../../Services/Product/product.service';
import { OrderService } from '../../../../Services/order/order.service';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
@ViewChild('searchInputByName') searchInputByName!: InputComponent;
@ViewChild('searchInputByBarcode') searchInputByBarcode!: InputComponent;

@Input() order:Order|null=null;
@Input()selectedCustomer:Customer={name:'' , id:-1};

customers!:Customer[];
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
