import { Component, computed, inject, signal } from '@angular/core';
import { CustomerService } from '../../Services/Customer/customer.service';
import { LanguageService } from '../../Services/Language/language.service';
import { Customer } from '../../Interfaces/customer';
import { ServiceInterface } from '../../Interfaces/service-interface';
import { FilterSection } from '../../Interfaces/filter-options';

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

  closeFilter:boolean=false;
  filterConfig= computed<FilterSection[]>(() => [
    {
      title: 'Search By Name or Phone',
      collapseId: 'collapseSearchBy',
      fields: [
        { type: 'input', controlName: 'searchKey', label: '', inputType: 'text', placeholder: '' },
      ]
    },
    {
      title: 'Customer Status',
      collapseId: 'collapseStatus',
      fields: [
        {
          type: 'radio',
          controlName: 'isActive',
          label: 'Customer Status',
          options: [
            { label: 'Active', value: true },
            { label: 'Inactive', value: false }
          ]
        }
      ]
    },
    {
      title: 'Gender',
      collapseId: 'collapseGender',
      fields: [
        {
          type: 'radio',
          controlName: 'gender',
          label: 'Gender',
          options: [
            { label: 'All', value: 'all' },
            { label: 'Males', value: 'males' },
            { label: 'Females', value: 'females' }

          ]
        }
      ]
    },
    {
      title: 'Register Date',
      collapseId: 'collapseRegisterDate',
      fields: [
        { type: 'input', controlName: 'startPeriod', label: 'From', inputType: 'date', placeholder: 'From' },
        { type: 'input', controlName: 'endPeriod', label: 'To', inputType: 'date', placeholder: 'To' },

      ]
    },
  ]);
  applyFilters(event:any) {
    const filters = event;
    this.closeFilter=true;
    }
  resetFilters() {
    // this.filterForm.reset();
  }
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


