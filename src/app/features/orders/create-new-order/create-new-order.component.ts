import { Component } from '@angular/core';
import { OrderService } from '../../../Services/order/order.service';

@Component({
  selector: 'app-create-new-order',
  standalone: false,
  templateUrl: './create-new-order.component.html',
  styleUrl: './create-new-order.component.scss'
})
export class CreateNewOrderComponent {

constructor(private __OrderService:OrderService){}
ngOnInit(): void {
  this.__OrderService.orderProducts.set([]);
  this.__OrderService.discount.set(0);
  this.__OrderService.setPaidAmount(0);

}
}
