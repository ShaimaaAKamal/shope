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
  customers=signal<Customer[]>([]);
  // totalItems=signal<number>(0);
  // currentPage=signal<number>(1);
  // pageSize= signal<number>(this.__HandleActualApiInvokeService.pageSize);


    fetchPaginatedCategories = (page: number, size: number) =>{
      return this.getCustomers({
        filters: [],
        sorts: [
          {
            propertyName: 'InsertedDate',
            descending: true
          }
        ],
        pagingModel: {
          index: page -1,
          length: size,
          all: false
        },
        properties: ''
      });
    }

  pagination = new PaginationStore<Customer>(this.fetchPaginatedCategories, 'customers',this.customers);

  constructor(private __CommonService:CommonService,
    private __ToastingMessagesService:ToastingMessagesService) {
      // this.getCustomers().subscribe({});
    }

//start of api

  // getCustomers(body?: any): Observable<Customer[]> {
  //   return this.__HandleActualApiInvokeService.getEntities<Customer>('GetCustomers', 'customers',this.customers, body)
  // }
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
