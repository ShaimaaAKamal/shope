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
      Categories: () => this.categoryService.getCategories(this.getRequestBody()).subscribe({
        next : data => this.categoryService.categories.set(data.data),
      }),
      Products: () => this.productService.getProducts(this.getRequestBody()).subscribe({
        next : data => this.productService.productsSignal.set(data.data),
      }),
      Customers: () => this.customerService.getCustomers(this.getRequestBody()).subscribe({
        next : data => this.customerService.customers.set(data.data),
      }),
      Orders: () => this.orderService.getOrders(this.getRequestBody()).subscribe({
        next : data => this.orderService.orders.set(data.data),
      }),
      Variants: () => this.productService.getVariants(this.getRequestBody()).subscribe({
        next : data => this.productService.variantOptions.set(data.data),
      })
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
      all: false
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
