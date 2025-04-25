import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavitemComponent } from './components/navitem/navitem.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NavSalesPersonComponent } from './components/nav-sales-person/nav-sales-person.component';
import { InputComponent } from './components/input/input.component';
import { SelectInputComponent } from './components/select-input/select-input.component';
import { QuantityControlComponent } from './components/quantity-control/quantity-control.component';
import { RouterModule } from '@angular/router';
import { KeypadComponent } from './components/keypad/keypad.component';



@NgModule({
  declarations: [
    NavitemComponent,
    SidenavComponent,
    NavSalesPersonComponent,
    InputComponent,
    SelectInputComponent,
    QuantityControlComponent,
    KeypadComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
        NavitemComponent,
        SidenavComponent,
        NavSalesPersonComponent,
         InputComponent,
        SelectInputComponent,
        QuantityControlComponent,
        KeypadComponent

  ]
})
export class SharedModule { }
