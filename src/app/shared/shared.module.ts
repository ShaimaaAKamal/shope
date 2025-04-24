import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavitemComponent } from './components/navitem/navitem.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AppRoutingModule } from '../app-routing.module';
import { NavSalesPersonComponent } from './components/nav-sales-person/nav-sales-person.component';



@NgModule({
  declarations: [
    NavitemComponent,
    SidenavComponent,
    NavSalesPersonComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports:[
        NavitemComponent,
        SidenavComponent,
        NavSalesPersonComponent
  ]
})
export class SharedModule { }
