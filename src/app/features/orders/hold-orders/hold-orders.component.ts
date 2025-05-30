import { Component, inject } from '@angular/core';
import { Order } from '../../../Interfaces/order';
import { Router } from '@angular/router';
import { OrderService } from '../../../Services/order/order.service';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-hold-orders',
  standalone: false,
  templateUrl: './hold-orders.component.html',
  styleUrl: './hold-orders.component.scss'
})
export class HoldOrdersComponent {

__OrderService=inject(OrderService);
holdOrders=this.__OrderService.HoldOrders;

__LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;

currency:string='SAR';
constructor(private __Router:Router){}

done(){
this.__Router.navigateByUrl('Orders/create');
}

showOrder(order:Order){
this.__Router.navigateByUrl(`Orders/Order/${order.code}`)
}


// deleteOrder(order: Order) {
//   this.__OrderService.deleteOrderBycode(order.code).subscribe((res) => {
//     this.__ToastingMessagesService.showToast(res.message, res.status ? 'success' : 'error');
//   });
// }

deleteOrder(order: Order) {
  this.__OrderService.deleteOrderBycode(order.code).subscribe({});
}

getLocalizedTime(date: string | Date | null | undefined): string {
  if (!date) return '';

  const time = new Date(date);
  if (isNaN(time.getTime())) return '';

  const locale = this.isRtl()  ? 'ar-EG' : 'en-US';

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(time);
}
}
