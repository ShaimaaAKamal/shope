import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { Customer } from '../../Interfaces/customer';
import { Order } from '../../Interfaces/order';
import { CommonService } from '../CommonService/common.service';
import { SalesPersonsService } from '../SalesPersons/sales-persons.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 orders=signal<Order[]>([])
 orderProducts=signal<Product[]>([]);
 discount=signal<number>(0);
 paidAmount = signal<number>(0);
 invoiveCustomer:Customer={name:'',nameAr:'',id:-1};

constructor(private __CommonService:CommonService,private __SalesPersonsService:SalesPersonsService){
  this.orders.set(this.__CommonService.getItemsFromStorage<Order[]>('orders',[]));
}

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

HoldOrders = computed(() => {
      return this.orders().filter(o => o.status=='hold');
  });

setInvoiveCustomer(customer:Customer){
this.invoiveCustomer=customer;
}

  setPaidAmount(value: number) {
    this.paidAmount.set(value);
  }

  addNewOrder(order:Order):{status:boolean,message:string}{
    let result=this.__CommonService.findItemInArray(this.orders(),o => o.code == order.code);
    if(result.exists) return {status:false , message : 'This order is already exist!'};
    else{
        this.setOrders([...this.orders(),order]);
        return {
            status: true,
            message: order.status === 'return'
              ? 'Order has been returned successfully!'
              : 'Order has been added successfully!'
          };
    }
  }

  // updateOrder(order:Order):{status:boolean,message:string}{
  //   // let result=this.__CommonService.findItemInArray(this.orders(),o => o.code == order.code && o.status == 'hold');
  //   let result=this.__CommonService.findItemInArray(this.orders(),o => o.code == order.code && o.status != 'paid');
  //   if(result.exists){
  //     this.orders()[result.ind]=order;
  //     this.setOrders([...this.orders()]);
  //     return  {status:true , message : 'Order has been updated successfully!'};;
  //   }else
  //     return (order.status == 'paid') ?
  //     {status:false , message : 'This Order is already been paid !'} :
  //     {status:false , message : "This Order  hasn't been updated !"};
  // }
    updateOrder(order:Order):{status:boolean,message:string}{
    let result=this.__CommonService.findItemInArray(this.orders(),o => o.code == order.code);
    if((result.exists && order.status == 'paid' && result.item.status == 'hold') || (result.exists && order.status == 'hold' && result.item.status == 'hold')){
      this.orders()[result.ind]=order;
      this.setOrders([...this.orders()]);
      return  {status:true , message : 'Order has been updated successfully!'};;
    }else
      return (result.item.status == 'paid') ?
      {status:false , message : 'This Order is already been paid !'} :
      {status:false , message : "This Order  hasn't been updated !"};
  }
  // updateOrderStatus(order:Order,status:string){
  //     let result=this.__CommonService.findItemInArray(this.orders(),o => o.id == order.id);
  //     if(result.exists){
  //     this.orders()[result.ind]['status']=status;
  //     this.setOrders([...this.orders()]);
  //     return  {status:true , message : 'Order has been updated successfully!'};;
  //   }else
  //     return {status:false , message : "This Order  hasn't been updated !"};
  // }
  updateOrderHasReturn(order:Order){
      let result=this.__CommonService.findItemInArray(this.orders(),o => o.id == order.id);
      if(result.exists){
      this.orders()[result.ind]=order;
      this.setOrders([...this.orders()]);
      return  {status:true , message : 'Order has been updated successfully!'};;
    }else
      return {status:false , message : "This Order  hasn't been updated !"};
  }
  setOrders(orders:Order[]){
      this.orders.set(orders);
      this.__CommonService.saveToStorage('orders',orders);
  }
  getOrderByCode(code:string){
   const result=this.__CommonService.findItemInArray(this.orders(), p => p.code == code)
   return result.exists?result.item:null
  }
  getOrderById(id:number){
   const result=this.__CommonService.findItemInArray(this.orders(), p => p.id == id)
   return result.exists?result.item:null
  }
  deleteOrderBycode(code:string){
   const newOrders=this.orders().filter(o => o.code != code);
   this.setOrders(newOrders);
  }

buildOrder(
  code:string,
  discount: number,
  status: string,
  paymentMethods: { cash: number; network: number; masterCard: number } = { cash: 0, network: 0, masterCard: 0 }
): Order {
  const id = this.orders().length + 1;
  const customer = this.invoiveCustomer;
  const salesPerson = this.__SalesPersonsService.currentSalesPerson();
  const products = this.orderProducts();
  const grossTotal = this.getGrossTotal();
  const time = new Date();
  console.log(customer);
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
