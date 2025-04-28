import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Order } from '../../../../Interfaces/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-item',
  standalone: false,
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})
export class OrderItemComponent {
private __Router=inject(Router);
@Input() order!:Order;
@Input() currency:string='SAR'
@Output() checkedItemCode=new EventEmitter<string>();

timeDifference: { unit: string, value: number }  = { unit: 'seconds', value: 0 };
personImage:string='person.jpg';

ngOnInit() {
  this.timeDifference = this.getSmartDateDifference(this.order.time);
}
getOrderCode(code:any){
 this.checkedItemCode.emit(code);
}
showOrder(code:string){
  this.__Router.navigateByUrl(`Orders/Order/${code}`)
}
getSmartDateDifference(time: Date | string): { unit: string, value: number } {
   const d1 = new Date();
   const d2 =new Date(time);

  const diffInMs = Math.abs(d2.getTime() - d1.getTime());

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30)); // Approximate month = 30 days

  if (months >= 1) {
    return { unit: 'months', value: months };
  } else if (days >= 1) {
    return { unit: 'days', value: days };
  } else if (hours >= 1) {
    return { unit: 'hours', value: hours };
  } else if (minutes >= 1) {
    return { unit: 'minutes', value: minutes };
  } else {
    return { unit: 'seconds', value: seconds };
  }
}
}
