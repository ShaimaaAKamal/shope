import { computed, inject, Injectable, signal } from '@angular/core';
import { Customer } from '../../Interfaces/customer';
import { Order } from '../../Interfaces/order';
import { CommonService } from '../CommonService/common.service';
import { SalesPersonsService } from '../SalesPersons/sales-persons.service';
import { of, tap } from 'rxjs';
import { SharedService } from '../Shared/shared.service';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
import { OrderProduct } from '../../Interfaces/order-product';
import { UserService } from '../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private __SharedService=inject(SharedService);

 orders=signal<Order[]>([])
 orderProducts=signal<OrderProduct[]>([]);
 discount=signal<number>(0);
 paidAmount = signal<number>(0);
//  invoiveCustomer:Customer={name:'',nameAr:'',id:-1};
 invoiveCustomer:Customer={} as Customer;

constructor(private __CommonService:CommonService,private __SalesPersonsService:SalesPersonsService,
  private __ToastingMessagesService:ToastingMessagesService,private __UserService:UserService
){

  this.getOrders().subscribe({});
}

// categoryAPiCall
getOrders() {
  // this.loadingSignal.set(true);

  return this.__SharedService.getAllByPost<Order>('GetOrders', 'categories').pipe(
    tap({
      next: (data) =>{this.orders.set([...data.data  || []])},
      // complete: () => this.loadingSignal.set(false),
    })
  );
}

createOrderApi(order: Order){
  return this.__SharedService.createByPost<Order>('CreateOrder', order, 'Order').pipe(
    tap((createdOrder) => {
      this.orders.update((orders) => [...orders, createdOrder['data']]);
    }));}

// updateOrderApi(order: Order) {
//    if (!order.id) {
//     throw new Error('Product ID is required for update.');
//   }
//   return this.__SharedService.update<Order>('Orders', order.id, order, 'Order').pipe(
//     tap((updatedOrder) => {
//       this.orders.update((orders) =>
//                 // orders.map((o) => (o.code=== updatedOrder.code ? updatedOrder : o))
//         orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
//       );
//     }));
// }


// deleteOrderApi(id: number){
//   return this.__SharedService.delete<Order>('Orders', id, 'Order').pipe(
//     tap(() => {
//       this.orders.update((orders) => orders.filter((o) => o.id !== id));
//     }));
// }

updateOrderApi(order: Order) {
  if (!order.id) {
   throw new Error('Product ID is required for update.');
 }
 return this.__SharedService.updateByPost<Order>('Orders', order, 'Order').pipe(
   tap((updatedOrder) => {
     this.orders.update((orders) =>
               // orders.map((o) => (o.code=== updatedOrder.code ? updatedOrder : o))
       orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
     );
   }));
}

deleteOrderApi(id: number){
  return this.__SharedService.deleteByPost<Order>('DeleteOrder', id, 'Order').pipe(
    tap(() => {
      this.orders.update((orders) => orders.filter((o) => o.id !== id));
    }));
}

///// Crud Methods


addNewOrder(order: Order){
  // let result = this.__CommonService.findItemInArray(this.orders(), o => o.code == order.code);
    let result = this.__CommonService.findItemInArray(this.orders(), o => o.id == order.id);
  if (result.exists) {
    this.__ToastingMessagesService.showToast( 'This order already exists!' ,'error');
        return of();
  } else {
    return this.createOrderApi(order);
  }
}

updateOrder(order: Order){
  console.log('updatedorder',order)
  // const result = this.__CommonService.findItemInArray(this.orders(), o => o.code === order.code);
  const result = this.__CommonService.findItemInArray(this.orders(), o => o.id === order.id);

  if (!result.exists) {
    const message = "This Order hasn't been updated!";
    this.__ToastingMessagesService.showToast(message, 'error');
  }

  const existingOrder = result.item;
  const canUpdate =
      (order.invoiceType === 2 && existingOrder.invoiceType === 1) ||
    (order.invoiceType === 1 && existingOrder.invoiceType === 1) ||
    (order.invoiceType === 2 && !existingOrder.remainingQty) ||
    (order.invoiceType === 2 && existingOrder.remainingQty && existingOrder.remainingQty > 0)
    // (order.status === 'paid' && existingOrder.status === 'hold') ||
    // (order.status === 'hold' && existingOrder.status === 'hold') ||
    // (order.status === 'paid' && !existingOrder.remainingQty) ||
    // (order.status === 'paid' && existingOrder.remainingQty && existingOrder.remainingQty > 0)
    if (!canUpdate) {
    const message = existingOrder.status === 'paid'
        ? 'This Order has already been paid!'
        : "This Order hasn't been updated!";


    this.__ToastingMessagesService.showToast(message, 'error');
  }

  return this.updateOrderApi(order);
}

// getOrderByCode(code:string){
//    const result=this.__CommonService.findItemInArray(this.orders(), p => p.code == code)
//    return result.exists?result.item:null
//   }
getOrderById(id:number){
   const result=this.__CommonService.findItemInArray(this.orders(), p => p.id == id)
   return result.exists?result.item:null
  }

// deleteOrderBycode(code: string){
//   const result = this.__CommonService.findItemInArray(this.orders(), o => o.code === code);

//   if (!result.exists) {
//     this.__ToastingMessagesService.showToast('Order not found!', 'error');
//   }
//   return this.deleteOrderApi(result.item.id);
// }

deleteOrderById(id: number){
  const result = this.__CommonService.findItemInArray(this.orders(), o => o.id === id);

  if (!result.exists) {
    this.__ToastingMessagesService.showToast('Order not found!', 'error');
  }
  return this.deleteOrderApi(result.item.id);
}

HoldOrders = computed(() => {
        return this.orders().filter(o => o.invoiceType==1);

      // return this.orders().filter(o => o.status=='hold');
  });

/// Order Invoice Calculations
getNetTotal = computed(() => {
    if (this.orderProducts().length === 0) return 0;
    // return this.orderProducts().reduce((total, product) => total + (parseFloat(product.quantity) * product.price), 0);
        // return this.orderProducts().reduce((total, product) => total + ((product.quantity) * product.price), 0);
                return this.orderProducts().reduce((total, product) => total + ((product.soldQuantity) * product.price), 0);

});

getTax = computed(() => {
    if (this.orderProducts().length === 0) return 0;
    return this.orderProducts().reduce(
      // (total, product) => total + parseFloat(product.quantity) * product.tax,
            // (total, product) => total +(product.quantity) * product.tax,
            (total, product) => total +(product.soldQuantity) * product.tax,

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

// UpdateProducts(products:Product[]){
UpdateProducts(products:OrderProduct[]){
  this.orderProducts.set([...products]);
}
// buildOrder(
//   order:Order | null,
//   code:string,
//   discount: number,
//   status: string,
//   paymentMethods: { cash: number; network: number; masterCard: number } = { cash: 0, network: 0, masterCard: 0 }
// ): Order {
//   const id = (order && order.id && status != 'return') ? order.id : this.__CommonService.getId();
//   const customer = this.invoiveCustomer;
//   const salesPerson = this.__SalesPersonsService.currentSalesPerson();
//   const products = this.orderProducts();
//   const grossTotal = this.getGrossTotal();
//   const time = new Date();
//   return {
//     id,
//     code,
//     customer,
//     salesPerson,
//     products,
//     grossTotal,
//     discount,
//     paymentMethods,
//     status,
//     time,
//   };
// }

buildOrder(
  order:Order | null,
  discount: number,
  invoiceType: number,
  paymentMethods: { cash: number; network: number; masterCard: number } = { cash: 0, network: 0, masterCard: 0 }
): Order {
  const customerId = this.invoiveCustomer.id;
  const shift= this.__SalesPersonsService.currentSalesPerson();
  const user = this.__UserService.currentUser();
  const products = this.orderProducts();
  console.log('log products to check id in them fot update fucyionality')
  console.log('orderProducts',products);
  console.log('check condition for invoice id as well')
  const invoiceDate = new Date();
  return {
      ...(order?.id && invoiceType !== 2 ? { id: order.id } : {}),
    customerId:customerId?? 0,
    shiftId:shift.id?? 0,
    shiftNumber:shift.shiftNumber,
    userId:user.id ?? '',
    paymentMethodId:1,
    cashAmount:paymentMethods.cash,
    networkAmount:paymentMethods.network,
    totalTax:this.getTax(),
    totalDiscount:discount,
    totalBeforeDiscount:this.getNetTotal(),
    totalAfterDiscount:this.getNetTotal()-discount,
    totalBeforeTax: this.getNetTotal()-discount,
    totalAfterTax: this.getGrossTotal(),
    couponCode:"",
    stopChange:false,
    invoiceType,
    invoiceDate,
    details:products
  };
}

// calculateTotalProducts(products:Product[]){
calculateTotalProducts(products:OrderProduct[]){
   if (products.length === 0) return 0;
    // return products.reduce((total, product) => total + parseFloat(product.quantity), 0);
        // return products.reduce((total, product) => total +(product.quantity), 0);
                return products.reduce((total, product) => total +(product.soldQuantity), 0);


}
}
