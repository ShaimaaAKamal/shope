import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { Customer } from '../../Interfaces/customer';
import { Order } from '../../Interfaces/order';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 orders=signal<Order[]>([])
 orderProducts=signal<Product[]>([]);
 discount=signal<number>(0);
 paidAmount = signal<number>(0);
 invoiveCustomer:Customer={name:'',id:-1};

constructor(private __CommonService:CommonService){}
UpdateProducts(products:Product[]){
  this.orderProducts.set([...products]);
}
 getNetTotal = computed(() => {
    if (this.orderProducts().length === 0) return 0;
    return this.orderProducts().reduce((total, product) => total + (parseFloat(product.quantity) * product.price), 0);
});

getTax = computed(() => {
    if (this.orderProducts().length === 0) return 0;
    return this.orderProducts().reduce(
      (total, product) => total + parseFloat(product.quantity) * product.tax,
      0
    );
  });

 getGrossTotal = computed(() => {
    return this.getNetTotal() + this.getTax() - this.discount();
  });

  getTotalQuantity = computed(() => {
    const products = this.orderProducts();
    if (products.length === 0) return 0;
    return products.reduce((total, product) => total + parseFloat(product.quantity), 0);
  });

 setInvoiveCustomer(customer:Customer){
this.invoiveCustomer=customer;
}

  dueAmount = computed(() => {
    const due = this.getGrossTotal() - this.paidAmount();
    return due < 0 ? 0 : due;
  });

  reminder = computed(() => {
    const remaining = this.paidAmount() - this.getGrossTotal();
    return remaining < 0 ? 0 : remaining;
  });

  setPaidAmount(value: number) {
    this.paidAmount.set(value);
  }
   addNewOrder(order:Order):boolean{
    let newOrders=[...this.orders(),order]
    this.orders.set(newOrders);
    this.__CommonService.saveToStorage('orders',newOrders);
    return true;
  }
}
