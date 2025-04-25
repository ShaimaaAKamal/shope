import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../Interfaces/order';
import { OrderService } from '../../../Services/order/order.service';
import { Customer } from '../../../Interfaces/customer';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  
  order!:Order;
  selectedCustomer:Customer={name:'' , id:-1};

  constructor(private __ActivatedRoute:ActivatedRoute,private __OrderService:OrderService){}

   ngOnInit(): void {
      const code = this.__ActivatedRoute.snapshot.paramMap.get('code');
      if(code){
          this.order=this.__OrderService.getOrderByCode(code);
       if(this.order) this.displayOrderDetails(this.order);
      }
  }

  displayOrderDetails(order:Order){
    this.__OrderService.orderProducts.set([...order?.products]);
    this.__OrderService.discount.set(order.discount);
    this.selectedCustomer=order.customer;
  }
}
