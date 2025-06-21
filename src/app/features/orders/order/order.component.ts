import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../Interfaces/order';
import { OrderService } from '../../../Services/order/order.service';
import { Customer } from '../../../Interfaces/customer';
import { CustomerService } from '../../../Services/Customer/customer.service';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {

  order!:Order;
  selectedCustomer!:Customer;
  selectedCustomerId!:number;
  constructor(private __ActivatedRoute:ActivatedRoute,private __OrderService:OrderService,private __CustomerService:CustomerService){}

   ngOnInit(): void {
      const id = this.__ActivatedRoute.snapshot.paramMap.get('id');
            // if(code ){
      if(id && Number(id)){
          // this.order=this.__OrderService.getOrderByCode(code);
      this.order=this.__OrderService.getOrderById(Number(id));
       if(this.order) this.displayOrderDetails(this.order);
      }
  }

  // displayOrderDetails(order:Order){
  //   this.__OrderService.orderProducts.set([...order?.products]);
  //   this.__OrderService.discount.set(order.discount);
  //   this.selectedCustomer=order.customer;
  // }
    displayOrderDetails(order:Order){
    this.__OrderService.orderProducts.set([...order?.details]);
    this.__OrderService.discount.set(order.totalBeforeDiscount - order.totalAfterDiscount);
    if(order.customerId)
      this.selectedCustomer=this.__CustomerService.getCustomerByID(order.customerId) ?? null ;
  }


}
