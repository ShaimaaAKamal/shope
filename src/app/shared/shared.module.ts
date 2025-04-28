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
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PopScreenComponent } from './components/pop-screen/pop-screen.component';
import { PageControlsComponent } from './components/page-controls/page-controls.component';
import { NoItemsComponent } from './components/no-items/no-items.component';
import { SiteButtonComponent } from './components/site-button/site-button.component';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    NavitemComponent,
    SidenavComponent,
    NavSalesPersonComponent,
    InputComponent,
    SelectInputComponent,
    QuantityControlComponent,
    KeypadComponent,
    NotFoundComponent,
    PopScreenComponent,
    PageControlsComponent,
    NoItemsComponent,
    SiteButtonComponent,
    InputCheckboxComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  exports:[
        NavitemComponent,
        SidenavComponent,
        NavSalesPersonComponent,
         InputComponent,
        SelectInputComponent,
        QuantityControlComponent,
        KeypadComponent,
        PopScreenComponent,
        PageControlsComponent,
        NoItemsComponent,
        SiteButtonComponent,
        InputCheckboxComponent,
        TranslateModule,
  ]
})
export class SharedModule { }
