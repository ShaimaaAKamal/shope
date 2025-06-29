import { inject, Injectable, signal } from '@angular/core';
import { Customer } from '../../Interfaces/customer';
import { CommonService } from '../CommonService/common.service';
import { SharedService } from '../Shared/shared.service';
import { Observable, tap, throwError } from 'rxjs';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  //  customers=signal<Customer[]>([
  //    {
  //   id:1,
  //   firstNameEn: "Ahmed",
  //   firstNameAr: "أحمد",
  //   lastNameEn: "Hassan",
  //   lastNameAr: "حسن",
  //   companyNameEn: "Future Tech",
  //   companyNameAr: "تكنولوجيا المستقبل",
  //   phone: "+201234567890",
  //   emailAddress: "ahmed.hassan@example.com",
  //   country: "Egypt",
  //   city: "Cairo",
  //   addressEn: "15 El Tahrir Street",
  //   addressAr: "١٥ شارع التحرير",
  //   notesEn: "Preferred customer",
  //   notesAr: "عميل مميز",
  //   dateOfBirth: new Date("1985-03-12"),
  //   crn: "CRN123456",
  //   vat: "VAT789012",
  //   governorate: "Giza",
  //   streetNumber: "15",
  //   buildingNumber: "B2",
  //   isActive: true,
  //   customerType: 1
  // },
  // {
  //   id:2,
  //   firstNameEn: "Sara",
  //   firstNameAr: "سارة",
  //   lastNameEn: "Fouad",
  //   lastNameAr: "فؤاد",
  //   companyNameEn: "Green Solutions",
  //   companyNameAr: "الحلول الخضراء",
  //   phone: "+201098765432",
  //   emailAddress: "sara.fouad@example.com",
  //   country: "Egypt",
  //   city: "Alexandria",
  //   addressEn: "22 Al Corniche Road",
  //   addressAr: "٢٢ طريق الكورنيش",
  //   notesEn: "Call before delivery",
  //   notesAr: "الاتصال قبل التوصيل",
  //   dateOfBirth: new Date("1992-07-22"),
  //   crn: "CRN654321",
  //   vat: "VAT210987",
  //   governorate: "Alexandria",
  //   streetNumber: "22",
  //   buildingNumber: "A1",
  //   isActive: false,
  //   customerType: 2
  // },
  // {
  //   id:3,
  //   firstNameEn: "Khaled",
  //   firstNameAr: "خالد",
  //   lastNameEn: "Ali",
  //   lastNameAr: "علي",
  //   companyNameEn: "Skyline Builders",
  //   companyNameAr: "سكاي لاين للمقاولات",
  //   phone: "+201112223344",
  //   emailAddress: "khaled.ali@example.com",
  //   country: "Egypt",
  //   city: "Mansoura",
  //   addressEn: "5 Nile Street",
  //   addressAr: "٥ شارع النيل",
  //   notesEn: "VIP client",
  //   notesAr: "عميل VIP",
  //   dateOfBirth: new Date("1978-11-05"),
  //   crn: "CRN789654",
  //   vat: "VAT456321",
  //   governorate: "Dakahlia",
  //   streetNumber: "5",
  //   buildingNumber: "C3",
  //   isActive: true,
  //   customerType: 3
  // }
  //  ]);
  private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);

  customers=signal<Customer[]>([]);

  constructor(private __CommonService:CommonService,
    private __ToastingMessagesService:ToastingMessagesService) {
      this.getCustomers().subscribe({});
    }

//start of api

  getCustomers(body?: any): Observable<Customer[]> {
    return this.__HandleActualApiInvokeService.getEntities<Customer>('GetCustomers', 'customers',this.customers, body)
  }
  createCustomer(customer: Customer) {
  return this.__HandleActualApiInvokeService.createEntity<Customer>(
    'CreateCustomer',
    customer,
    'Customer',
    this.customers
  );
}
  deleteCustomer(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<Customer>(
    'DeleteCustomer',
    id,
    'Customer',
    this.customers,
  );
}

  updateCustomer(customer: Customer) {
    return this.__HandleActualApiInvokeService.updateEntity<Customer>(customer, {
      apiMethod: 'UpdateCustomer',
      signal: this.customers,
      entityName: 'Customer',
      duplicateCheck: (c) =>
        this.customers().some(x => x.phone === c.phone && x.id !== c.id)
    });
  }
    getCustomer(id:number){
      return this.__HandleActualApiInvokeService.getEntityById<Customer>('GetCustomer', id, 'customer');
  }



  //end of api


  addCustomer(customer: Customer): Observable<any> {
    const result = this.__CommonService.findItemInArray(this.customers(), c => c.phone === customer.phone);

    if (result.exists) {
      this.__ToastingMessagesService.showToast('This Customer already exists!', 'error');
      return throwError(() => new Error('Customer already exists'));
    } else {
      return this.createCustomer(customer);
    }
  }



    getCustomerByID(id:number){
      // return this.customers().find(customer => customer.id == id) ?? {} as Customer;
     return this.getCustomer(id);
    }
}
