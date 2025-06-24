import { Component, inject, TemplateRef, ViewChild, effect, signal } from '@angular/core';
import { CustomerService } from '../../Services/Customer/customer.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../Services/Language/language.service';
import { Customer } from '../../Interfaces/customer';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  __CustomerService = inject(CustomerService);
  __LanguageService = inject(LanguageService);

  // __Router = inject(Router);
  addCustomer = signal(false);
  editCustomer=signal(false);
  customers = this.__CustomerService.customers;
  del: boolean = false;
  customer!:Customer;


  addNew(event: any) {
    this.addCustomer.set(true);
    // this.__Router.navigateByUrl('Orders/create');
  }
  deleteSelected(_del: boolean): void {
    // this.__CustomerService.deleteCustomers(this.checkeCustomers).subscribe();
}
getEditCUstomerInfo(customer:Customer){
  this.customer=customer;
  this.editCustomer.set(true);
}
closeCreateCustomer(){
  this.addCustomer.set(false);
}
closeEditCustomer(){
  this.editCustomer.set(false);
}

}


