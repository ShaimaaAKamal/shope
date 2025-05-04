import { Injectable, signal } from '@angular/core';
import { Customer } from '../../Interfaces/customer';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   customers=signal<Customer[]>([
    {name:"Mohamed Ahmed",nameAr:'محمد احمد',id:1,phone:"01020432563"},
   { name:"Ali Muhamed",nameAr:'علي محمد',id:2,phone:"01020432563"},
    {name:"Omar Ali",nameAr:'عمر علي',id:3,phone:"01020432563"}
  ]);
  constructor(private __CommonService:CommonService) {
      this.customers.set(this.__CommonService.getItemsFromStorage<  Customer[]>('customers',[]));
   }


  addCustomer(customer:Customer){
     let result=this.__CommonService.findItemInArray(this.customers(),c => c.phone == customer.phone);
    if(result.exists) return {status:false , message : 'This Customer is already exist!'};
    else{
        this.setCustomers([...this.customers(),customer]);
        return {status:true , message : 'customer has been added successfully!'};
    }
  }

    setCustomers(customers:Customer[]){
        this.customers.set(customers);
        this.__CommonService.saveToStorage('customers',customers);
    }
}
