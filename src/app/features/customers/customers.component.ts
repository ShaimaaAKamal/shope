import { Component, inject, signal } from '@angular/core';
import { CustomerService } from '../../Services/Customer/customer.service';
import { LanguageService } from '../../Services/Language/language.service';
import { Customer } from '../../Interfaces/customer';
import { ServiceInterface } from '../../Interfaces/service-interface';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  __CustomerService = inject(CustomerService);
  __LanguageService = inject(LanguageService);

  addCustomer = signal(false);
  editCustomer=signal(false);
  customers = this.__CustomerService.customers;
  del: boolean = false;
  customer!:Customer;
  servicesList:ServiceInterface[]=[];

  addNew(event: any) {
    this.addCustomer.set(true);
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


