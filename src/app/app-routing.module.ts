import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { GuestGuard } from './guards/Guest/guest.guard';
import { AuthGuard } from './guards/Auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo:"Orders/create" ,pathMatch:'full'},
  { path: 'New Order', redirectTo:"Orders/create" },
  {path:'Variants_Library',redirectTo:'Products/Variants_Library'},
  {path:'Categories',redirectTo:'Products/Categories'},
  { path: 'Products',canActivate: [AuthGuard],  loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
  { path: 'Orders', canActivate: [AuthGuard], loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'Customers',canActivate: [AuthGuard],  loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'Users',canActivate: [AuthGuard], loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) },
  { path: 'Auth',  canActivate: [GuestGuard],loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  {path:"**",component:NotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
