import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  inject
} from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { Customer } from '../../../Interfaces/customer';

@Component({
  selector: 'app-add-in-voice-new-customer',
  standalone:false,
  templateUrl: './add-in-voice-new-customer.component.html',
  styleUrl: './add-in-voice-new-customer.component.scss',
})
export class AddInVoiceNewCustomerComponent {
  @Output() closeCustomerForm = new EventEmitter<void>();
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @Input() CompoenentData={
    header:'Add Customer',
    customer:{} as Customer
  }
  private __CustomerService = inject(CustomerService);

  errorMessages: Record<string, string> = {};

  ActiveDropDownSelection = 'Active';
  customerTypeSelection = 'Super';

  readonly ActiveOptions = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false },
  ];

  readonly customerTypes = [
    { title: 'Super', value: 1 },
    { title: 'Regular', value: 2 },
  ];

  readonly inputFields = [
    { id: 'firstNameEn', label: 'First Name (En)', icon: 'fa-solid fa-signature', required: true },
    { id: 'firstNameAr', label: 'First Name (Ar)', icon: 'fa-solid fa-signature', required: true },
    { id: 'lastNameEn', label: 'Last Name (En)', icon: 'fa-solid fa-signature', required: true },
    { id: 'lastNameAr', label: 'Last Name (Ar)', icon: 'fa-solid fa-signature', required: true },
    { id: 'companyNameEn', label: 'Company Name (En)', icon: 'fa-solid fa-signature',required: true },
    { id: 'companyNameAr', label: 'Company Name (Ar)', icon: 'fa-solid fa-signature',required: true },
    { id: 'phone', label: 'Customer Phone', icon: 'fa-solid fa-phone-volume', required: true },
    { id: 'emailAddress', label: 'Email Address', icon: 'fa-solid fa-envelope', required: true },
    { id: 'country', label: 'Country', icon: 'fa-solid fa-globe', required: true },
    { id: 'city', label: 'City', icon: 'fa-solid fa-city' , required: true},
    { id: 'addressEn', label: 'Address (En)', icon: 'fa-solid fa-city' },
    { id: 'addressAr', label: 'Address (Ar)', icon: 'fa-solid fa-city' },
    { id: 'notesEn', label: 'Notes (En)', icon: 'fa-solid fa-globe' },
    { id: 'notesAr', label: 'Notes (Ar)', icon: 'fa-solid fa-city' },
    { id: 'dateOfBirth', label: 'Birthday', type: 'Date', icon: 'fa-solid fa-calendar' },
    { id: 'crn', label: 'CRN', icon: 'fa-solid fa-globe' },
    { id: 'vat', label: 'VAT', icon: 'fa-solid fa-city' },
    { id: 'governorate', label: 'Governorate', icon: 'fa-solid fa-globe' },
    { id: 'streetNumber', label: 'Street Number', icon: 'fa-solid fa-city' },
    { id: 'buildingNumber', label: 'Building Number', icon: 'fa-solid fa-city' },
  ];



  ngAfterViewInit(): void {
    if(this.CompoenentData.customer.id){
      this.fillInputFieldsFromCustomer(this.CompoenentData.customer);
}
  }

fillInputFieldsFromCustomer(customer: Customer) {
    this.inputFields.forEach(field => {
      const inputComp = this.inputs.find(input => input.InputComponentData.id === field.id);
      if (!inputComp) return;

      let value: any;

      if (field.id === 'dateOfBirth' && customer.dateOfBirth) {
        value = new Date(customer.dateOfBirth).toISOString().split('T')[0];
      } else {
        value = (customer as any)[field.id];
      }

      if (value !== undefined) {
        inputComp.inputElement.nativeElement.value = value;
      }
    });

    setTimeout(() => {
      const type = this.customerTypes.find(t => t.value === customer.customerType);
      this.customerTypeSelection = type?.title ?? 'Super';

      const active = this.ActiveOptions.find(a => a.value === customer.isActive);
      this.ActiveDropDownSelection = active?.title ?? 'Inactive';
    });
  }

  validateFields(): void {
    this.errorMessages = {};
    this.inputFields.forEach((field) => {
      const value = this.getInputValue(field.id);
      if (field.required && !value?.trim()) {
        this.errorMessages[field.id] = `${field.label} is required.`;
      }
    });
  }

  getInputValue(id: string): string {
    return this.inputs.find(i => i.InputComponentData?.id === id)?.value || '';
  }

  changeSelect(event: any, key: 'isActive' | 'customerType') {
    if (key === 'isActive') this.ActiveDropDownSelection = event.title;
    else if (key === 'customerType') this.customerTypeSelection = event.title;
  }

  done(): void {
    this.validateFields();
    if (Object.keys(this.errorMessages).length > 0) return;

    const customerData = Object.fromEntries(
      this.inputFields.map(field => [field.id, this.getInputValue(field.id)])
    ) as unknown as Omit<Customer, 'customerType' | 'isActive' | 'dateOfBirth'>;

    const customer = {
      ...customerData,
      customerType: this.customerTypes.find(t => t.title === this.customerTypeSelection)?.value ?? 1,
      isActive: this.ActiveOptions.find(a => a.title === this.ActiveDropDownSelection)?.value ?? true,
      dateOfBirth: (() => {
        const val = this.getInputValue('dateOfBirth');
        return val ? new Date(val) : new Date();
      })()
    } as Customer;

    if(this.CompoenentData.customer.id){
      const updatedCustomer={...customer,id:this.CompoenentData.customer.id};

      this.__CustomerService.updateCustomer(updatedCustomer).subscribe({
        next :() =>this.closeCustomerForm.emit()
      });
    }
    else{
      this.__CustomerService.addCustomer(customer).subscribe({
        next :() =>this.closeCustomerForm.emit()
      })
    }
  }

  close(): void {
    this.closeCustomerForm.emit();
  }
}
