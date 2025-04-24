import { Component, inject } from '@angular/core';
import { OrderService } from '../../../../Services/order/order.service';

@Component({
  selector: 'app-summary',
  standalone: false,
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  private __OrderService=inject(OrderService)
  netTotal=this.__OrderService.getNetTotal;
  tax=this.__OrderService.getTax;
  grossTotal=this.__OrderService.getGrossTotal;
}
