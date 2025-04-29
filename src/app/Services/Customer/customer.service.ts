import { Injectable, signal } from '@angular/core';
import { Customer } from '../../Interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
   customers=signal<Customer[]>([
    {name:"Mohamed Ahmed",nameAr:'محمد احمد',id:1},
   { name:"Ali Muhamed",nameAr:'علي محمد',id:2},
    {name:"Omar Ali",nameAr:'عمر علي',id:3}
  ]);
  constructor() { }
}
