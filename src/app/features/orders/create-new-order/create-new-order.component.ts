import { Component, inject, signal ,effect} from '@angular/core';
import { OrderService } from '../../../Services/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-new-order',
  standalone: false,
  templateUrl: './create-new-order.component.html',
  styleUrl: './create-new-order.component.scss'
})
export class CreateNewOrderComponent {

__Route=inject(ActivatedRoute);
popupVisible = signal(false);
popupRetuenOrderVisible = signal(false);
queryParamsSignal= toSignal(this.__Route.queryParamMap);
constructor(private __OrderService:OrderService){
   const _ = effect(() => {
    const popup = this.queryParamsSignal()?.get('popup');
    this.popupVisible.set(popup === 'hold_orders');
    this.popupRetuenOrderVisible.set(popup === 'return_orders');
  });
}

ngOnInit(): void {
  this.__OrderService.orderProducts.set([]);
  this.__OrderService.discount.set(0);
  this.__OrderService.setPaidAmount(0);
}

}
