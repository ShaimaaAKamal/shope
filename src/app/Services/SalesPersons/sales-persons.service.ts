import { Injectable, signal } from '@angular/core';
import { SalesPerson } from '../../Interfaces/sales-person';

@Injectable({
  providedIn: 'root'
})
export class SalesPersonsService {

  salesPersons=signal<SalesPerson[]>([]);
  currentSalesPerson=signal<SalesPerson>({  id:-1,
  startDate: new Date(),
  openingBalance: 0,
  userId: "icheowqifhveiow",shiftNumber: 122,status: 0});

  SetCurrentSalesPerson(salesPerson:SalesPerson){
    this.currentSalesPerson.set(salesPerson);
  }
}
