import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { Customer } from '../../Interfaces/customer';
import { Order } from '../../Interfaces/order';
import { CommonService } from '../CommonService/common.service';
import { SalesPersonsService } from '../SalesPersons/sales-persons.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/orders';

 orders=signal<Order[]>([])
 orderProducts=signal<Product[]>([]);
 discount=signal<number>(0);
 paidAmount = signal<number>(0);
 invoiveCustomer:Customer={name:'',nameAr:'',id:-1};

constructor(private __CommonService:CommonService,private __SalesPersonsService:SalesPersonsService){
  this.getOrders();
}


// api functions
getOrders(): void {
  this.http.get<Order[]>(this.baseUrl).subscribe({
    next: (data) => {
      this.orders.set(data);
    },
    error: (err) => {
      console.error('Failed to load orders:', err);
    }
  });
}

createOrderApi(order: Order): Observable<{ status: boolean, message: string }> {
  return this.http.post<Order>(this.baseUrl, order).pipe(
    tap((createdOrder) => {
      this.orders.update((orders) => [...orders, createdOrder]);
    }),
    map(() => ({
      status: true,
      message: order.status === 'return'
        ? 'Order has been returned successfully!'
        : 'Order has been added successfully!'
    })),
    catchError((error) => {
      console.error('Failed to create order:', error);
      return of({ status: false, message: 'Failed to create order!' });
    })
  );
}

updateOrderApi(order: Order): Observable<{ status: boolean, message: string }> {
  return this.http.put<Order>(`${this.baseUrl}/${order.id}`, order).pipe(
    tap((updatedOrder) => {
      this.orders.update((orders) =>
        orders.map((o) => (o.code === updatedOrder.code ? updatedOrder : o))
      );
    }),
    map(() => ({
      status: true,
      message: 'Order has been updated successfully!'
    })),
    catchError((error) => {
      console.error('Failed to update order:', error);
      return of({ status: false, message: 'Failed to update order!' });
    })
  );
}

deleteOrderApi(id: number): Observable<{ status: boolean, message: string }> {
  return this.http.delete(`${this.baseUrl}/${id}`).pipe(
    tap(() => {
      this.orders.update((orders) => orders.filter((o) => o.id !== id));
    }),
    map(() => ({
      status: true,
      message: 'Order has been deleted successfully!'
    })),
    catchError((error) => {
      console.error('Failed to delete order:', error);
      let message = 'Failed to delete order!';
      if (error.status === 404) message = 'Order not found!';
      return of({ status: false, message });
    })
  );
}
///// Crud Methods

addNewOrder(order: Order): Observable<{ status: boolean, message: string }> {
  let result = this.__CommonService.findItemInArray(this.orders(), o => o.code == order.code);
  if (result.exists) {
    return of({ status: false, message: 'This order already exists!' });
  } else {
    return this.createOrderApi(order);
  }
}

updateOrder(order: Order): Observable<{ status: boolean, message: string }> {
  const result = this.__CommonService.findItemInArray(this.orders(), o => o.code === order.code);

  if (!result.exists) {
    return of({ status: false, message: "This Order hasn't been updated!" });
  }

  const existingOrder = result.item;
  const canUpdate =
    (order.status === 'paid' && existingOrder.status === 'hold') ||
    (order.status === 'hold' && existingOrder.status === 'hold') ||
    (order.status === 'paid' && !existingOrder.hasARetrun && order.hasARetrun)
  if (!canUpdate) {
    return of({
      status: false,
      message: existingOrder.hasARetrun
      ? 'This Order has already been returned before!'
      : existingOrder.status === 'paid'
        ? 'This Order has already been paid!'
        : "This Order hasn't been updated!"
    });
  }

  return this.updateOrderApi(order);
}

getOrderByCode(code:string){
   const result=this.__CommonService.findItemInArray(this.orders(), p => p.code == code)
   return result.exists?result.item:null
  }

deleteOrderBycode(code: string): Observable<{ status: boolean, message: string }> {
  const result = this.__CommonService.findItemInArray(this.orders(), o => o.code === code);

  if (!result.exists) {
    return of({ status: false, message: 'Order not found!' });
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
    if (products.length === 0) return 0;
    return products.reduce((total, product) => total + parseFloat(product.quantity), 0);
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
  // const id = (order && order.id && status != 'return') ? order.id : this.orders().length + 1;
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
    time
  };
}
}
