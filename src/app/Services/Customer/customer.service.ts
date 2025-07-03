import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { Customer } from '../../Interfaces/customer';
import { CommonService } from '../CommonService/common.service';
import { Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { ToastingMessagesService } from '../ToastingMessages/toasting-messages.service';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';
import { PaginationStore } from '../../shared/stores/pagination-store.store';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
  private __CommonService=inject(CommonService);
  customers=signal<Customer[]>([]);


  searchFn = (searchKey: string) => {
      const filters = [
        {
          operation: 3,
          propertyName: 'phone',
          propertyValue: searchKey
        },
      ];

      return this.__CommonService.createSearchFn(filters, (body) => this.getCustomers(body));
    };
  fetchPaginatedCustomers = this.__CommonService.createPaginatedFetcher<Customer>(
  this.getCustomers.bind(this),
   );
  pagination = new PaginationStore<Customer>(this.fetchPaginatedCustomers,this.customers);

  constructor(private __ToastingMessagesService:ToastingMessagesService) {}

//start of api

  getCustomers(body?: any): Observable<{data:Customer[],totalCount:number}>  {
    return this.__HandleActualApiInvokeService.getEntities<Customer>('GetCustomers', 'customers',this.customers, body)
  }
  createCustomer(customer: Customer) {
  return this.__HandleActualApiInvokeService.createEntity<Customer>(
    'CreateCustomer',
    customer,
    'Customer',
    this.customers
  ).pipe(
    tap(response => this.pagination.refresh() )
    );
}
  deleteCustomer(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<Customer>(
    'DeleteCustomer',
    id,
    'Customer',
    this.customers,
  ).pipe(
    tap(response => this.pagination.refresh() )
    );;
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
