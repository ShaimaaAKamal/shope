import { computed, inject, Injectable, signal } from '@angular/core';
import { Customer } from '../../Interfaces/customer';
import { Order } from '../../Interfaces/order';
import { CommonService } from '../CommonService/common.service';
import { SalesPersonsService } from '../SalesPersons/sales-persons.service';
import { Observable, of, tap } from 'rxjs';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
import { OrderProduct } from '../../Interfaces/order-product';
import { UserService } from '../User/user.service';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 orders=signal<Order[]>([])
 orderProducts=signal<OrderProduct[]>([]);
 discount=signal<number>(0);
 paidAmount = signal<number>(0);
 invoiveCustomer:Customer={} as Customer;
 currency:string='SAR';
private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
constructor(private __CommonService:CommonService,private __SalesPersonsService:SalesPersonsService,
  private __ToastingMessagesService:ToastingMessagesService,private __UserService:UserService
){

  this.getOrders().subscribe({});
}

// categoryAPiCall

// getOrders(body?: any): Observable<Order[]> {
//     return this.__HandleActualApiInvokeService.getEntities<Order>('GetOrders', 'GetOrders',this.orders, body)
//   }

getOrders(body?: any): Observable<{data:Order[],totalCount:number}> {
  return this.__HandleActualApiInvokeService.getEntities<Order>('GetOrders', 'GetOrders',this.orders, body)
}

createOrderApi(order: Order) {
  return this.__HandleActualApiInvokeService.createEntity<Order>(
    'CreateOrder',
    order,
    'Order',
    this.orders
  );
}

updateOrderApi(order: Order) {
  return this.__HandleActualApiInvokeService.updateEntity<Order>(order, {
    apiMethod: 'Orders',
    signal: this.orders,
    entityName: 'Order'
  });
}


deleteOrderApi(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<Order>(
    'DeleteOrder',
    id,
    'Order',
    this.orders,
  );
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

// getTax = computed(() => {
//     if (this.orderProducts().length === 0) return 0;
//     return this.orderProducts().reduce(
//       // (total, product) => total + parseFloat(product.quantity) * product.tax,
//             // (total, product) => total +(product.quantity) * product.tax,
//             (total, product) => total +(product.soldQuantity) * product.tax,
//       0
//     );
//   });

getTax = computed(() => {
  if (this.orderProducts().length === 0) return 0;

  return this.orderProducts().reduce((total, product) => {
    const quantity = Number(product.soldQuantity) || 0;
    const tax = Number(product.tax) || 0;
    return total + quantity * tax;
  }, 0);
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
