import { Injectable, signal } from '@angular/core';
import { SalesPerson } from '../../Interfaces/sales-person';

@Injectable({
  providedIn: 'root'
})
export class SalesPersonsService {

   salesPersons=signal<SalesPerson[]>([]);
  currentSalesPerson=signal<SalesPerson>({name:'',id:-1});

  SetCurrentSalesPerson(salesPerson:SalesPerson){
    this.currentSalesPerson.set(salesPerson);
  }
}
