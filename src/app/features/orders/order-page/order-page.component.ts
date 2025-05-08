import { Component, computed, effect, inject, Input, ViewChild } from '@angular/core';
import { LanguageService } from '../../../Services/Language/language.service';
import { Order } from '../../../Interfaces/order';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderService } from '../../../Services/order/order.service';
import { PopScreenComponent } from '../../../shared/components/pop-screen/pop-screen.component';
import { OrderStatus } from '../../../Interfaces/order-status';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-order-page',
  standalone: false,
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {
// private __Language=inject(LanguageService);
// private __Route=inject(ActivatedRoute);
// previousRoute:string='';
// nextRoute:string='';
// id!:number;
// order!:Order;
// isRtl=this.__Language.rtlClassSignal;
// paramMapSignal = toSignal(this.__Route.paramMap, { initialValue: null});
// orderIdSignal = computed(() => Number(this.paramMapSignal()?.get('id') ?? ''));
// orderStatusSelection:string='';
// showOrderStatus:boolean=false;
// OrderStatuses:OrderStatus[]= [
//   { id: 1, name: 'hold' },
//   { id: 2, name: 'paid' },
//   { id: 3, name: 'waiting for Processing' },
//   { id: 4, name: 'in Progress' },
//   { id: 5, name: 'shipped' },
//   { id: 5, name: 'delivered' },
//   { id: 6, name: 'cancelled' }
// ];
// @ViewChild('updateOrderStatusForm') updateOrderStatusForm!:PopScreenComponent;

//   constructor(private __OrderService:OrderService,private __Router:Router,private __ToastingMessagesService:ToastingMessagesService) {
//     effect(() => {
//       this.id = this.orderIdSignal();
//       this.order=this.__OrderService.getOrderById(this.id);
//       if( !this.order) this.__Router.navigateByUrl('notFound');
//       else{
//         this.orderStatusSelection=this.order.status;
//       }
//     });
//   }

//   showUpdateOrderStatusForm(){
//     this.showOrderStatus=true;
//   }
//   clearStatusForm(){
//         this.showOrderStatus=false;
//   }
//    chooseStatus(newOrderStatus:OrderStatus){
//     this.orderStatusSelection=newOrderStatus.name
//   }
//   updateStatus(){
//    const result= this.__OrderService.updateOrderStatus(this.order,this.orderStatusSelection);
//    this.showOrderStatus=false;
//    (result.status) ?
//    this.__ToastingMessagesService.showToast(result.message,'success'):
//   this.__ToastingMessagesService.showToast(result.message,'error');
//   }

}
