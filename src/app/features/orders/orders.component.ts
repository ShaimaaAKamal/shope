import {Component,inject,ViewChild,TemplateRef,OnInit, computed} from '@angular/core';
import { OrderService } from '../../Services/order/order.service';
import { Router } from '@angular/router';
import { ServiceInterface } from '../../Interfaces/service-interface';
import { FilterSection } from '../../Interfaces/filter-options';

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
  servicesList:ServiceInterface[]=[]

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


  closeFilter:boolean=false;
  filterConfig= computed<FilterSection[]>(() => [
    {
      title: 'Order Status',
      collapseId: 'collapseOrderStatus',
      fields: [
        {
          type: 'checkbox',
          controlName: 'all',
          label: 'All',
          options: [
            { label: 'All', value: 'true' },
          ]
        },
        {
          type: 'checkbox',
          controlName: 'hold',
          label: 'Hold',
          options: [
            { label: 'Hold', value: true },
          ]
        },
        {
          type: 'checkbox',
          controlName: 'paid',
          label: 'Paid',
          options: [
            { label: 'Paid', value: 'true' },
          ]
        },
        {
          type: 'checkbox',
          controlName: 'returned',
          label: 'Returned',
          options: [
            { label: 'Returned', value: 'true' },
          ]
        },
        {
          type: 'checkbox',
          controlName: 'cancalled',
          label: 'Cancalled',
          options: [
            { label: 'Cancalled', value: 'true' },
          ]
        },
      ]
    },
    {
      title: 'Payment Methods',
      collapseId: 'collapsePaymentMethod',
      fields: [
        {
          type: 'checkbox',
          controlName: 'all',
          label: 'All',
          options: [
            { label: 'All', value: 'true' },
          ]
        },
        {
          type: 'checkbox',
          controlName: 'cash',
          label: 'Cash',
          options: [
            { label: 'Cash', value: true },
          ]
        },
        {
          type: 'checkbox',
          controlName: 'Network',
          label: 'Network',
          options: [
            { label: 'Network', value: 'true' },
          ]
        }
      ]
    },
    {
      title: 'Sort Orders',
      collapseId: 'collapseSortOrders',
      fields: [
        {
          type: 'radio',
          controlName: 'sortOrders',
          label: 'Sort Orders',
          options: [
            { label: 'Order Number - Ascend', value: 'orderNumberAscend' },
            { label: 'Order Number - Descend', value: 'orderNumberDescend' },
            { label: 'Order Total - Ascend', value: 'orderTotalAscend' },
            { label: 'Order Total - Descend', value: 'orderTotalDescend' },
            { label: 'Order Date - Ascend', value: 'orderDateAscend' },
            { label: 'Order Date - Descend', value: 'orderDateDescend' },
          ]
        }
      ]
    },
    {
      title: 'Order Date',
      collapseId: 'collapseOrderDate',
      fields: [
        { type: 'input', controlName: 'startPeriod', label: 'From', inputType: 'date', placeholder: 'From' },
        { type: 'input', controlName: 'endPeriod', label: 'To', inputType: 'date', placeholder: 'To' },
      ]
    },
  ]);
  applyFilters(event:any) {
    const filters = event;
    this.closeFilter=true;
    }
  resetFilters() {
    // this.filterForm.reset();
  }
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

  // handleDispalyedItems(event: any) {
  //   this.orders.set([...event]);
  // }

  addNew(event: any) {
    this.__Router.navigateByUrl('Orders/create');
  }

  // handleDelete(event: any) {
  //   this.del=true;
  // }
  deleteSelected(event:any){}
}
