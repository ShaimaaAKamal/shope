// import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
// import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
// import { ThemeService } from '../../../Services/Theme/theme.service';
// import { LanguageService } from '../../../Services/Language/language.service';
// import { CategoryService } from '../../../Services/Category/category.service';
// import { ProductService } from '../../../Services/Product/product.service';
// import { CustomerService } from '../../../Services/Customer/customer.service';
// import { Router } from '@angular/router';
// import { OrderService } from '../../../Services/order/order.service';
// import { CommonService } from '../../../Services/CommonService/common.service';

// @Component({
//   selector: 'app-layout-header',
//   standalone: false,
//   templateUrl: './layout-header.component.html',
//   styleUrl: './layout-header.component.scss'
// })

// export class LayoutHeaderComponent implements OnInit, OnDestroy {
//   // @Input() page: string = 'Products';
//   private __CommonService=inject(CommonService);
//   page=this.__CommonService.page;
//   private __ThemeService = inject(ThemeService);
//   private __LanguageService = inject(LanguageService);
//   private __CategoryService = inject(CategoryService);
//   private __ProductService = inject(ProductService);
//   private __CustomerService = inject(CustomerService);
//   private __OrderService = inject(OrderService);

//   private __Router=inject(Router)

//   isRtl = this.__LanguageService.rtlClassSignal;
//   dropdownSelection: string = 'Products';
//   selectionMessage: string = this.getMessage('Products');
//   searchKey: string = '';

//   private destroy$ = new Subject<void>();
//   private searchKeyChanged$ = new Subject<string>();
//   constructor(){
//     effect(() => {
//       this.dropdownSelection = this.page() ? this.page() : 'Choose' ;
//       this.selectionMessage = this.getMessage(this.page());
//     });
//   }

//   ngOnInit(): void {
//     this.searchKeyChanged$
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         takeUntil(this.destroy$)
//       )
//       .subscribe(() => {
//         this.sendSearchRequest();
//       });
//   }

//   onSearchKeyChange(value: string) {
//     this.searchKeyChanged$.next(value);
//   }

//   changeSelection(action: string) {
//     this.dropdownSelection = action;
//     this.selectionMessage = this.getMessage(action);
//   }

//   getRoute(){
//     switch(this.dropdownSelection){
//       case "Categories" :return this.__Router.navigateByUrl('Products/Categories');
//       case "Products" :return this.__Router.navigateByUrl('Products');
//       case "Customers" :return this.__Router.navigateByUrl('Customers');
//       case "Orders" :return this.__Router.navigateByUrl('Orders');
//       case "Variants" :return this.__Router.navigateByUrl('Products/Variants_Library');
//       default:return;
//     }
//   }
//   private getMessage(action: string): string {
//     switch (action) {
//       case 'Products':
//         return 'Search by product name , category name or sku';
//       case 'Customers':
//         return 'Search by customer name , phone number';
//       case 'Orders':
//         return 'Search by order number , customer name';
//       case 'Categories':
//         return 'Search by category name';
//       case 'Variants':
//         return 'Search by variant name , variant type';
//       default:
//         return 'Search.......';
//     }
//   }

//   sendSearchRequest() {
//     this.getRoute();
//     switch (this.dropdownSelection) {
//       case 'Categories': {
//         this.__CategoryService.getCategories(this.getRequestBody()).subscribe({ });
//         break;
//       };
//       case 'Products': {
//         this.__ProductService.getProducts(this.getRequestBody()).subscribe({});
//         break;
//       };
//       case 'Customers': {
//         this.__CustomerService.getCustomers(this.getRequestBody()).subscribe({});
//         break;
//       };
//       case 'Orders': {
//         this.__OrderService.getOrders(this.getRequestBody()).subscribe({});
//         break;
//       };
//       case 'Variants': {
//         this.__ProductService.getVariants(this.getRequestBody()).subscribe({});
//         break;
//       };
//     }
//   }

//   getRequestBody() {
//     switch (this.dropdownSelection) {
//       case 'Categories':
//         return {
//           sorts: [],
//           filters: [
//             {
//               operation: 3,
//               propertyName: this.isRtl() ? 'nameAr' : 'nameEn',
//               propertyValue: this.searchKey
//             }
//           ],
//           pagingModel: {
//             index: 0,
//             length: 0,
//             all: true
//           },
//           properties: ''
//         };
//         case 'Products':
//           return {
//             sorts: [],
//             filters: [
//               {
//                 operation: 3,
//                 propertyName: this.isRtl() ? 'nameAr' : 'nameEn',
//                 propertyValue: this.searchKey
//               },
//               {
//                 operation: 3,
//                 propertyName: 'sku',
//                 propertyValue: this.searchKey
//               }
//             ],
//             pagingModel: {
//               index: 0,
//               length: 0,
//               all: true
//             },
//             properties: ''
//           };
//       case "Customers":
//         return {
//           sorts: [],
//           filters: [
//             {
//               operation: 3,
//               propertyName: 'phone',
//               propertyValue: this.searchKey
//             }
//           ],
//           pagingModel: {
//             index: 0,
//             length: 0,
//             all: true
//           },
//           properties: ''
//         };
//         case "Variants":
//         return {
//           sorts: [],
//           filters: [
//             {
//               operation: 3,
//               propertyName: this.isRtl()?'variantTypeAr':'variantTypeEn',
//               propertyValue: this.searchKey
//             }
//           ],
//           pagingModel: {
//             index: 0,
//             length: 0,
//             all: true
//           },
//           properties: ''
//         };
//         case "Orders":
//           return {
//             sorts: [],
//             filters: [
//               {
//                 operation: 3,
//                 propertyName: 'id',
//                 propertyValue: this.searchKey
//               }
//             ],
//             pagingModel: {
//               index: 0,
//               length: 0,
//               all: true
//             },
//             properties: ''
//           };
//       default:
//         return {};
//     }
//   }

//   changeTheme() {
//     this.__ThemeService.toggleTheme();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   showLoyalPoint() {}
// }

import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  effect
} from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs';

import { ThemeService } from '../../../Services/Theme/theme.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { CategoryService } from '../../../Services/Category/category.service';
import { ProductService } from '../../../Services/Product/product.service';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { OrderService } from '../../../Services/order/order.service';
import { CommonService } from '../../../Services/CommonService/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-header',
  standalone: false,
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly searchKeyChanged$ = new Subject<string>();

  private readonly commonService = inject(CommonService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly customerService = inject(CustomerService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  isRtl = this.languageService.rtlClassSignal;
  page = this.commonService.page;

  dropdownSelection = 'Products';
  selectionMessage = this.getSearchMessage('Products');
  searchKey = '';

  constructor() {
    effect(() => {
      const selected = this.page() || 'Choose';
      this.dropdownSelection = selected;
      this.selectionMessage = this.getSearchMessage(selected);
    });
  }

  ngOnInit(): void {
    this.searchKeyChanged$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.sendSearchRequest());
  }

  onSearchKeyChange(value: string): void {
    this.searchKeyChanged$.next(value);
  }

  changeSelection(action: string): void {
    this.dropdownSelection = action;
    this.selectionMessage = this.getSearchMessage(action);
    this.sendSearchRequest();
  }

  private getSearchMessage(action: string): string {
    const messages: Record<string, string> = {
      Products: 'Search by product name , category name or sku',
      Customers: 'Search by customer name , phone number',
      Orders: 'Search by order number , customer name',
      Categories: 'Search by category name',
      Variants: 'Search by variant name , variant type'
    };
    return messages[action] ?? 'Search.......';
  }

  private getRoutePath(): string | null {
    const routes: Record<string, string> = {
      Products: 'Products',
      Categories: 'Products/Categories',
      Customers: 'Customers',
      Orders: 'Orders',
      Variants: 'Products/Variants_Library'
    };
    return routes[this.dropdownSelection] ?? null;
  }

  private getServiceMethod() {
    const services: Record<string, () => void> = {
      Categories: () => this.categoryService.getCategories(this.getRequestBody()).subscribe(),
      Products: () => this.productService.getProducts(this.getRequestBody()).subscribe(),
      Customers: () => this.customerService.getCustomers(this.getRequestBody()).subscribe(),
      Orders: () => this.orderService.getOrders(this.getRequestBody()).subscribe(),
      Variants: () => this.productService.getVariants(this.getRequestBody()).subscribe()
    };
    return services[this.dropdownSelection];
  }

  sendSearchRequest(): void {
    const routePath = this.getRoutePath();
    if (routePath) {
      this.router.navigateByUrl(routePath);
    }

    const serviceCall = this.getServiceMethod();
    serviceCall?.();
  }

  private getRequestBody(): any {
    const commonPaging = {
      index: 0,
      length: 0,
      all: true
    };

    const filtersBySelection: Record<string, any[]> = {
      Categories: [
        {
          operation: 3,
          propertyName: this.isRtl() ? 'nameAr' : 'nameEn',
          propertyValue: this.searchKey
        }
      ],
      Products: [
        {
          operation: 3,
          propertyName: this.isRtl() ? 'nameAr' : 'nameEn',
          propertyValue: this.searchKey
        },
        {
          operation: 3,
          propertyName: 'sku',
          propertyValue: this.searchKey
        }
      ],
      Customers: [
        {
          operation: 3,
          propertyName: 'phone',
          propertyValue: this.searchKey
        }
      ],
      Variants: [
        {
          operation: 3,
          propertyName: this.isRtl() ? 'variantTypeAr' : 'variantTypeEn',
          propertyValue: this.searchKey
        }
      ],
      Orders: [
        {
          operation: 3,
          propertyName: 'id',
          propertyValue: this.searchKey
        }
      ]
    };

    return {
      sorts: [],
      filters: filtersBySelection[this.dropdownSelection] ?? [],
      pagingModel: commonPaging,
      properties: ''
    };
  }

  changeTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showLoyalPoint(): void {}
}
