import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Customer } from '../../../Interfaces/customer';
import { LanguageService } from '../../../Services/Language/language.service';
import { CustomerService } from '../../../Services/Customer/customer.service';

@Component({
  selector: 'app-customer-card',
  standalone: false,
  templateUrl: './customer-card.component.html',
  styleUrl: './customer-card.component.scss'
})
export class CustomerCardComponent {

  private __LanguageService=inject(LanguageService);
  private __CustomerService=inject(CustomerService)

  isRtl= this.__LanguageService.rtlClassSignal;
  @Input() customer!:Customer;
  @Output() editCustomer=new EventEmitter<Customer>();
  editCustomerfN(customer:Customer){
     this.editCustomer.emit(customer);
  }
  deleteCustomer(deleteCustomer:Customer){
   this.__CustomerService.deleteCustomer(deleteCustomer.id!).subscribe({})
  }

  getFullAddress(){
    return this.isRtl()
        ? this.customer.addressAr
        : [this.customer.addressEn, this.customer.city, this.customer.country].filter(part => part && part.trim() !== '').join(', ')
  }


}
