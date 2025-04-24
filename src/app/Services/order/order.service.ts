import { Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { Customer } from '../../Interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderProducts=signal<Product[]>([]);
 invoiveCustomer:Customer={name:'',id:-1};

 setInvoiveCustomer(customer:Customer){
this.invoiveCustomer=customer;
}
getTotalQuantity(): number {
  if(this.orderProducts().length==0 ) return 0;
  return this.orderProducts().reduce((total, product) => total + parseFloat(product.quantity), 0);
}
}
