import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { CreateNewOrderComponent } from './create-new-order/create-new-order.component';
import { OrderComponent } from './order/order.component';
import { ReturnOrderComponent } from './return-order/return-order.component';

const routes: Routes = [
  { path: '', component: OrdersComponent  },
  { path: 'create', component: CreateNewOrderComponent },
  { path: 'Return_Order', component: ReturnOrderComponent },
  { path: 'Order/:id', component: OrderComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {
 }
