import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { AddInVoiceNewCustomerComponent } from './add-in-voice-new-customer/add-in-voice-new-customer.component';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerCardComponent,
    AddInVoiceNewCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ]
  ,exports:[
    AddInVoiceNewCustomerComponent
  ]
})
export class CustomersModule { }
