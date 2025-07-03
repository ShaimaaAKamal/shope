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
  filter,
  takeUntil
} from 'rxjs';

import { ThemeService } from '../../../Services/Theme/theme.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { CategoryService } from '../../../Services/Category/category.service';
import { ProductService } from '../../../Services/Product/product.service';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { OrderService } from '../../../Services/order/order.service';
import { CommonService } from '../../../Services/CommonService/common.service';
import { NavigationEnd, Router , Event as RouterEvent } from '@angular/router';

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
    let runCount = 0;
    effect(() => {
      runCount++;
      const selected = this.page() || 'Choose';
      this.dropdownSelection = selected;
      if(runCount == 2)
       this.checkStoredKey();
      this.selectionMessage = this.getSearchMessage(selected);
    });
  }
  private previousUrl: string | null = null;
  ngOnInit(): void {

    this.router.events
    .pipe(
      takeUntil(this.destroy$),
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe(event => {
      const currentPath = event.urlAfterRedirects.split('?')[0];
      const previousPath = this.previousUrl?.split('?')[0] ?? null;

      if (previousPath !== null && previousPath !== currentPath) {
        this.clearSearchKey();

      }
      this.previousUrl = event.urlAfterRedirects;
    });

    this.searchKeyChanged$
      // .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.sendSearchRequest());
  }

  private clearSearchKey() {
    this.searchKey = '';
    localStorage.removeItem('searchKey');
    this.searchKeyChanged$.next('');

  }

  private getServiceAndPagination(selection: string):any {
    switch (selection) {
      case 'Products':
        return {
          pagination: this.productService.pagination,
          searchFn: this.productService.searchFn.bind(this.productService),
        };
      case 'Categories':
        return {
          pagination: this.categoryService.pagination,
          searchFn: this.categoryService.searchFn.bind(this.categoryService),
        };
      case 'Customers':
        return {
          pagination: this.customerService.pagination,
          searchFn: this.customerService.searchFn.bind(this.customerService),
        };
      default:
        return null;
    }
  }

  checkStoredKey() {
    const savedSearchKey = localStorage.getItem('searchKey');
    if (!savedSearchKey) return;

    this.searchKey = savedSearchKey;
    const service = this.getServiceAndPagination(this.dropdownSelection);
    if (!service) return;

    service.pagination?.setFetchFn(service.searchFn(savedSearchKey));
    service.pagination?.refresh();
  }

  sendSearchRequest(): void {
    const routePath = this.getRoutePath();
    if (routePath) this.router.navigateByUrl(routePath);

    const service = this.getServiceAndPagination(this.dropdownSelection);
    if (!service) return;

    service.pagination?.setFetchFn(service.searchFn(this.searchKey));
  }
  onSearchKeyChange(value: string): void {
    this.searchKey = value;
    localStorage.setItem('searchKey', value);
    this.searchKeyChanged$.next(value);
  }

  changeSelection(action: string): void {
    this.dropdownSelection = action;
    this.selectionMessage = this.getSearchMessage(action);
    this.searchKey='';
    localStorage.removeItem('searchKey');
    localStorage.setItem('dropdownSelection', action);
    this.sendSearchRequest();
  }


  private getSearchMessage(action: string): string {
    const messages: Record<string, string> = {
      Products: 'Search by product name, category name or SKU',
      Customers: 'Search by customer name, phone number',
      Orders: 'Search by order number, customer name',
      Categories: 'Search by category name',
      Variants: 'Search by variant name, variant type'
    };
    return messages[action] ?? 'Search...';
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

  changeTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showLoyalPoint(): void {}
}
