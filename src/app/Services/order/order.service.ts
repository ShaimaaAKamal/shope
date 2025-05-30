import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { Customer } from '../../Interfaces/customer';
import { Order } from '../../Interfaces/order';
import { CommonService } from '../CommonService/common.service';
import { SalesPersonsService } from '../SalesPersons/sales-persons.service';
import { of, tap } from 'rxjs';
import { SharedService } from '../Shared/shared.service';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private __SharedService=inject(SharedService);

 orders=signal<Order[]>([])
 orderProducts=signal<Product[]>([]);
 discount=signal<number>(0);
 paidAmount = signal<number>(0);
 invoiveCustomer:Customer={name:'',nameAr:'',id:-1};

constructor(private __CommonService:CommonService,private __SalesPersonsService:SalesPersonsService,
  private __ToastingMessagesService:ToastingMessagesService
){
    this.__SharedService.getAll<Order>('Orders','orders').subscribe(orders => {
      this.orders.set(orders)
  });
}

createOrderApi(order: Order){
  return this.__SharedService.create<Order>('Orders', order, 'Order').pipe(
    tap((createdOrder) => {
      this.orders.update((orders) => [...orders, createdOrder]);
    }));}

updateOrderApi(order: Order) {
  return this.__SharedService.update<Order>('Orders', order.id, order, 'Order').pipe(
    tap((updatedOrder) => {
      this.orders.update((orders) =>
        orders.map((o) => (o.code === updatedOrder.code ? updatedOrder : o))
      );
    }));
}


deleteOrderApi(id: number){
  return this.__SharedService.delete<Order>('Orders', id, 'Order').pipe(
    tap(() => {
      this.orders.update((orders) => orders.filter((o) => o.id !== id));
    }));
}

///// Crud Methods


addNewOrder(order: Order){
  let result = this.__CommonService.findItemInArray(this.orders(), o => o.code == order.code);
  if (result.exists) {
    this.__ToastingMessagesService.showToast( 'This order already exists!' ,'error');
        return of();
  } else {
    return this.createOrderApi(order);
  }
}

updateOrder(order: Order){
  const result = this.__CommonService.findItemInArray(this.orders(), o => o.code === order.code);

  if (!result.exists) {
    const message = "This Order hasn't been updated!";
    this.__ToastingMessagesService.showToast(message, 'error');
  }

  const existingOrder = result.item;
  const canUpdate =
    (order.status === 'paid' && existingOrder.status === 'hold') ||
    (order.status === 'hold' && existingOrder.status === 'hold') ||
    (order.status === 'paid' && !existingOrder.remainingQty) ||
    (order.status === 'paid' && existingOrder.remainingQty && existingOrder.remainingQty > 0)
  // if (!canUpdate) {
  //   const message = existingOrder.hasARetrun
  //     ? 'This Order has already been returned before!'
  //     : existingOrder.status === 'paid'
  //       ? 'This Order has already been paid!'
  //       : "This Order hasn't been updated!";
    if (!canUpdate) {
    const message = existingOrder.status === 'paid'
        ? 'This Order has already been paid!'
        : "This Order hasn't been updated!";


    this.__ToastingMessagesService.showToast(message, 'error');
  }

  return this.updateOrderApi(order);
}

getOrderByCode(code:string){
   const result=this.__CommonService.findItemInArray(this.orders(), p => p.code == code)
   return result.exists?result.item:null
  }

deleteOrderBycode(code: string){
  const result = this.__CommonService.findItemInArray(this.orders(), o => o.code === code);

  if (!result.exists) {
    this.__ToastingMessagesService.showToast('Order not found!', 'error');
  }
  return this.deleteOrderApi(result.item.id);
}

HoldOrders = computed(() => {
      return this.orders().filter(o => o.status=='hold');
  });

/// Order Invoice Calculations
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
   const grossTotal=this.getNetTotal() + this.getTax() - this.discount();
    return grossTotal< 0 ? 0 :grossTotal;
  });

getTotalQuantity = computed(() => {
    const products = this.orderProducts();
    return this.calculateTotalProducts(products);
  });

dueAmount = computed(() => {
    const due = this.getGrossTotal() - this.paidAmount();
    return due < 0 ? 0 : due;
  });

reminder = computed(() => {
    const remaining = this.paidAmount() - this.getGrossTotal();
    return remaining < 0 ? 0 : remaining;
  });

setInvoiveCustomer(customer:Customer){
this.invoiveCustomer=customer;
}

setPaidAmount(value: number) {
    this.paidAmount.set(value);
  }

UpdateProducts(products:Product[]){
  this.orderProducts.set([...products]);
}
buildOrder(
  order:Order | null,
  code:string,
  discount: number,
  status: string,
  paymentMethods: { cash: number; network: number; masterCard: number } = { cash: 0, network: 0, masterCard: 0 }
): Order {
  const id = (order && order.id && status != 'return') ? order.id : this.__CommonService.getId();
  const customer = this.invoiveCustomer;
  const salesPerson = this.__SalesPersonsService.currentSalesPerson();
  const products = this.orderProducts();
  const grossTotal = this.getGrossTotal();
  const time = new Date();
  return {
    id,
    code,
    customer,
    salesPerson,
    products,
    grossTotal,
    discount,
    paymentMethods,
    status,
    time,
  };
}
calculateTotalProducts(products:Product[]){
   if (products.length === 0) return 0;
    return products.reduce((total, product) => total + parseFloat(product.quantity), 0);
}
}
