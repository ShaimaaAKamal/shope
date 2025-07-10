import { Component, effect, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { Order } from '../../../../Interfaces/order';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../Services/Language/language.service';

@Component({
  selector: 'app-order-item',
  standalone: false,
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})
export class OrderItemComponent {
private __Router=inject(Router);
private __LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;
@Input() order!:Order;
@Input() currency:string='SAR'
@Output() checkedItemCode=new EventEmitter<string>();

getOrderId(id:any){
 this.checkedItemCode.emit(id);
}
printOrder(){
  console.log('print order');
}
returnOrder(){
 this.__Router.navigate(['/Orders/Return_Order'], {
  state: { order: this.order}
});
}

getStatus(invoiceType:number){
 switch (invoiceType) {
  case 1:
    return 'Hold';
  case 2:
    return 'Paid';
  case 3:
    return 'Returned';
  case 4:
    return 'Cancelled';
  default:
    return 'Unknown';
}
}
}
