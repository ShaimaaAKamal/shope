import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { CreateNewOrderComponent } from './create-new-order/create-new-order.component';
import { OrderProductsComponent } from './shared/order-products/order-products.component';
import { SharedModule } from '../../shared/shared.module';
import { SummaryComponent } from './shared/summary/summary.component';
import { HomePaymentComponent } from './shared/home-payment/home-payment.component';
import { PaymentButtonsComponent } from './shared/payment-buttons/payment-buttons.component';


@NgModule({
  declarations: [
    OrdersComponent,
    CreateNewOrderComponent,
    OrderProductsComponent,
    SummaryComponent,
    HomePaymentComponent,
    PaymentButtonsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    OrdersRoutingModule,

  ]
})
export class OrdersModule {
 
}
