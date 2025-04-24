import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'orders', loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'orders', loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
