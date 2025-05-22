import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { Customer } from '../../../Interfaces/customer';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';
import { CommonService } from '../../../Services/CommonService/common.service';

@Component({
  selector: 'app-add-in-voice-new-customer',
  standalone: false,
  templateUrl: './add-in-voice-new-customer.component.html',
  styleUrl: './add-in-voice-new-customer.component.scss'
})
export class AddInVoiceNewCustomerComponent {
@Output() closeCustomerForm=new EventEmitter<void>();

@ViewChild('customerName') customerName!:InputComponent;
@ViewChild('customeArabicrName') customeArabicrName!:InputComponent;
@ViewChild('customerPhone') customerPhone!:InputComponent;


private __CustomerService=inject(CustomerService);
private __ToastingMessagesService=inject(ToastingMessagesService);
private __CommonService=inject(CommonService);
customerNameError:string='';
customerPhoneError:string='';
customerArabicNameError:string='';
  validate(): boolean {
    let isValid = true;

    if (!this.customerName.value?.trim()) {
      this.customerNameError = 'Customer name is required';
      isValid = false;
    } else {
      this.customerNameError = '';
    }

    if (!this.customeArabicrName.value?.trim()) {
      this.customerArabicNameError = 'Customer Arabic name is required';
      isValid = false;
    } else {
      this.customerArabicNameError = '';
    }

    if (!this.customerPhone.value?.trim()) {
      this.customerPhoneError = 'Phone number is required';
      isValid = false;
    } else {
      this.customerPhoneError = '';
    }

    return isValid;
  }

  done() {
    if (!this.validate()) return;

    const customer: Customer = {
      id: this.__CommonService.getId(),
      name: this.customerName.value,
      nameAr: this.customeArabicrName.value,
      phone: this.customerPhone.value
    };

    const result = this.__CustomerService.addCustomer(customer);
    const toastType = result.status ? 'success' : 'error';
    this.__ToastingMessagesService.showToast(result.message, toastType);

    this.closeCustomerForm.emit();
  }

close(){
this.closeCustomerForm.emit()
}
}
