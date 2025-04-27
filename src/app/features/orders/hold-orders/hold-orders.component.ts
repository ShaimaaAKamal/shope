import { Component, inject } from '@angular/core';
import { Order } from '../../../Interfaces/order';
import { Router } from '@angular/router';
import { CommonService } from '../../../Services/CommonService/common.service';
import { OrderService } from '../../../Services/order/order.service';

@Component({
  selector: 'app-hold-orders',
  standalone: false,
  templateUrl: './hold-orders.component.html',
  styleUrl: './hold-orders.component.scss'
})
export class HoldOrdersComponent {

__CommonService=inject(CommonService);
 getTimeFromDate=this.__CommonService.getTimeFromDate;
__OrderService=inject(OrderService);
holdOrders=this.__OrderService.HoldOrders;
constructor(private __Router:Router){}

done(){
this.__Router.navigateByUrl('Orders/create');
}

showOrder(order:Order){
this.__Router.navigateByUrl(`Orders/Order/${order.code}`)
}
}
