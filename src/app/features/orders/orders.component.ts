// import { Component, inject, signal } from '@angular/core';
// import { OrderService } from '../../Services/order/order.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-orders',
//   standalone: false,
//   templateUrl: './orders.component.html',
//   styleUrl: './orders.component.scss'
// })
// export class OrdersComponent {
//  __OrderService=inject(OrderService);
// __Router=inject(Router);

//  orders=this.__OrderService.orders;
//  columns:any[]=[];

//  ngOnInit(): void {

//   this.columns = [
//     {
//       name: '',
//       prop: '$$checkbox',
//       width: 50,
//       sortable: false,
//       canAutoResize: false,
//       draggable: false,
//       resizeable: false,
//       checkboxable: true,
//       headerCheckboxable: true,
//       isCheckboxColumn: true
//     },
//      {
//       name: 'Id',
//       prop: 'id',
//       mobileVisible: true,
//       tabletVisible: true,
//     },
//      {
//       name: 'Date',
//       prop: 'invoiceDate',
//       mobileVisible: false,
//       tabletVisible: false,
//       largeVisible:false,
//     },
//     {
//       name: 'Total Price',
//       prop: 'totalAfterTax',
//       mobileVisible: true,
//       tabletVisible: true
//     },
//   //    {
//   //     name: 'paymentMethods',
//   //     prop: 'paymentMethods',
//   //     mobileVisible: false,
//   //     tabletVisible: false,
//   //     largeVisible:false,
//   //   },
//   // ,{
//   //     name: 'Customer',
//   //     prop: 'customer',
//   //     mobileVisible: false,
//   //     tabletVisible: false
//   //   },
//   //   {
//   //     name: 'Seller',
//   //     prop: 'salesPerson',
//   //     mobileVisible: false,
//   //     tabletVisible: false,
//   //     largeVisible:false,
//   //   },
//       {
//       name: 'Invoice Type',
//       prop: 'invoiceType',
//       mobileVisible: false,
//       tabletVisible: true,
//       cellClass: ({ row }: any) =>
//         row.invoiceType === 2? 'status-active' : 'status-inactive'
//         // row.status === 'paid' ? 'status-active' : 'status-inactive'
//     },
//     {
//       name: 'Items No',
//       prop: 'details',
//       mobileVisible: false,
//       tabletVisible: true
//     }
//   ];
//  }

//  handleRowsDeletion($event:any){}

//  handleDispalyedItems(event:any){
//     this.orders.set([...event]);

//  }
//  addNew(event:any){
//   this.__Router.navigateByUrl('Orders/create');
//  }
//  handleDelete(event:any){}
//  getCheckedItemCode(code:string){}
// }

import {Component,inject,ViewChild,TemplateRef,OnInit} from '@angular/core';
import { OrderService } from '../../Services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  __OrderService = inject(OrderService);
  __Router = inject(Router);

  orders = this.__OrderService.orders;
  columns: any[] = [];
  del:boolean=false;
  // 👇 Reference to custom cell template for "Invoice Type"
  @ViewChild('invoiceTypeTpl', { static: true })
  invoiceTypeTpl!: TemplateRef<any>;

  @ViewChild('invoiceDateTp2', { static: true })
invoiceDateTp2!: TemplateRef<any>;

@ViewChild('defaultValueTpl', { static: true }) defaultValueTpl!: TemplateRef<any>;
@ViewChild('invoicePaymentMethodTpl', { static: true })
invoicePaymentMethodTpl!: TemplateRef<any>;
  // 👇 Optional cleaner map for display values
  invoiceTypeMap: Record<number, string> = {
    1: 'Hold',
    2: 'Paid',
    3: 'Return',
    4: 'cancalled'
  };
  invoicePaymentMethods: Record<number, string> = {
    1: 'Cash',
    2: 'Network',
  };
  ngOnInit(): void {
    this.columns = [
      {
        name: '',
        prop: '$$checkbox',
        width: 50,
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizeable: false,
        checkboxable: true,
        headerCheckboxable: true,
        isCheckboxColumn: true
      },
      {
        name: 'Id',
        prop: 'id',
        mobileVisible: true,
        tabletVisible: true
      },
      {
        name: 'Date',
        prop: 'invoiceDate',
        mobileVisible: false,
        tabletVisible: false,
        largeVisible: false,
        cellTemplate: this.invoiceDateTp2,
      },
      {
        name: 'Payment Method',
        prop: 'paymentMethodId',
        mobileVisible: true,
        tabletVisible: true,
        cellTemplate: this.invoicePaymentMethodTpl,

      },{
        name: 'Cash',
        prop: 'cashAmount',
        mobileVisible: true,
        tabletVisible: true
      },
      {
        name: 'Network',
        prop: 'networkAmount',
        mobileVisible: true,
        tabletVisible: true
      },
      {
        name: 'Total Price',
        prop: 'totalAfterTax',
        mobileVisible: true,
        tabletVisible: true,
      },
      {
        name: 'Invoice Type',
        prop: 'invoiceType',
        mobileVisible: false,
        tabletVisible: true,
        cellTemplate: this.invoiceTypeTpl,
        cellClass: ({ row }: any) => {
          switch (row.invoiceType) {
            case 1:
              return 'status-hold';
            case 2:
              return 'status-paid';
            case 3:
              return 'status-return';
            default:
              return 'status-unknown';
          }
        }
      },
      {
        name: 'Coupon Code',
        prop: 'couponCode',
        mobileVisible: false,
        tabletVisible: true,
      }
    ];

    this.columns = this.columns.map(col => {
      if (!col.cellTemplate && col.prop !== '$$checkbox') {
        return { ...col, cellTemplate: this.defaultValueTpl };
      }
      return col;
    });
  }

  updateOrders($event: any) {
    this.orders.set($event);
    console.log($event);
  }

  handleDispalyedItems(event: any) {
    this.orders.set([...event]);
  }

  addNew(event: any) {
    this.__Router.navigateByUrl('Orders/create');
  }

  handleDelete(event: any) {
    this.del=true;
  }

}
