import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../Services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
 __OrderService=inject(OrderService);
__Router=inject(Router);

 orders=this.__OrderService.orders;
 handleDispalyedItems(event:any){
    this.orders.set([...event]);

 }
 addNew(event:any){
  this.__Router.navigateByUrl('Orders/create');
 }
 handleDelete(event:any){}
 getCheckedItemCode(code:string){}

}
