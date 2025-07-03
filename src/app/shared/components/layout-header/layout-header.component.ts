import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  effect
} from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
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
import { PaginationContextService } from '../../../Services/PaginationContext/pagination-context.service';

@Component({
  selector: 'app-layout-header',
  standalone: false,
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent implements OnInit, OnDestroy {
  private readonly paginationCtx = inject(PaginationContextService);
  private readonly destroy$ = new Subject<void>();
  private readonly searchKeyChanged$ = new Subject<string>();

  private readonly commonService = inject(CommonService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly customerService = inject(CustomerService);
  // private readonly orderService = inject(OrderService);
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

    // this.router.events
    // .pipe(
    //   takeUntil(this.destroy$),
    //   filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    // )
    // .subscribe(event => {
    //   const currentPath = event.urlAfterRedirects.split('?')[0];
    //   const previousPath = this.previousUrl?.split('?')[0] ?? null;

    //   if (previousPath !== null && previousPath !== currentPath) {
    //     this.clearSearchKey();
    //   }
    //   this.previousUrl = event.urlAfterRedirects;
    // });

    this.router.events
  .pipe(
    takeUntil(this.destroy$),
    filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
  )
  .subscribe(event => {
    const currentPath = event.urlAfterRedirects.split('?')[0];
    const previousPath = this.previousUrl?.split('?')[0] ?? null;
    const excludedRoutes = ['/Orders/create'];
    if (
      previousPath !== null &&
      previousPath !== currentPath &&
      !excludedRoutes.includes(currentPath)
    ) {
      this.clearSearchKey();
    }
    this.previousUrl = event.urlAfterRedirects;
  });

    this.searchKeyChanged$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.sendSearchRequest());
  }

  private clearSearchKey() {
    console.log('in seacrh key');
    this.searchKey = '';
    this.commonService.removeItemFromStorage('searchKey')
    this.searchKeyChanged$.next('');

  }

  private getEntityConfig(selection: string): {
    key: string;
    getFn: (body?: any) => Observable<{ data: any[]; totalCount: number }>;
    propertyName: string;
  } | null {
    switch (selection) {
      case 'Products':
        return {
          key: 'Products',
          getFn: this.productService.getProducts.bind(this.productService),
          propertyName: 'nameEn'
        };
      case 'Categories':
        return {
          key: 'Categories',
          getFn: this.categoryService.getCategories.bind(this.categoryService),
          propertyName: 'nameEn'
        };
      case 'Customers':
        return {
          key: 'Customers',
          getFn: this.customerService.getCustomers.bind(this.customerService),
          propertyName: 'phone'
        };
      case 'Variants':
        return {
          key: 'Variants',
          getFn: this.productService.getVariants.bind(this.productService),
          propertyName: 'nameEn'
        };
      case 'Variant Types':
        return {
          key: 'Variant Types',
          getFn: this.productService.getVariantTypes.bind(this.productService),
          propertyName: 'nameEn'
        };
      default:
        return null;
    }
  }



  checkStoredKey() {
    const savedSearchKey = this.commonService.getItemsFromStorage('searchKey','');
    if (!savedSearchKey) return;

    this.searchKey = savedSearchKey;
    const config = this.getEntityConfig(this.dropdownSelection);
    if (!config) return;

    const searchFn = this.paginationCtx.getSearchFn(config.key, config.propertyName, config.getFn);
    this.paginationCtx.getStore(config.key)?.setFetchFn(searchFn(savedSearchKey));
    this.paginationCtx.getStore(config.key)?.refresh();
  }

  sendSearchRequest(): void {
    const routePath = this.getRoutePath();
    console.log('routePath',routePath);
    if (routePath) this.router.navigateByUrl(routePath);

    const config = this.getEntityConfig(this.dropdownSelection);
    if (!config) return;

    const searchFn = this.paginationCtx.getSearchFn(config.key, config.propertyName, config.getFn);
    this.paginationCtx.getStore(config.key)?.setFetchFn(searchFn(this.searchKey));
  }

  onSearchKeyChange(value: string): void {
    this.searchKey = value;
    this.commonService.saveToStorage('searchKey',value);
    this.searchKeyChanged$.next(value);
  }

  changeSelection(action: string): void {
    this.dropdownSelection = action;
    this.selectionMessage = this.getSearchMessage(action);
    this.searchKey='';
    this.commonService.removeItemFromStorage('searchKey');
    this.commonService.saveToStorage('dropdownSelection',action);
    this.sendSearchRequest();
  }


  private getSearchMessage(action: string): string {
    const messages: Record<string, string> = {
      Products: 'Search by product name, category name or SKU',
      Customers: 'Search by customer name, phone number',
      Orders: 'Search by order number, customer name',
      Categories: 'Search by category name',
      Variants: 'Search by variant name, variant type',
      'Variant Types': 'Search by variant type name'
    };
    return messages[action] ?? 'Search...';
  }

  private getRoutePath(): string | null {
    const routes: Record<string, string> = {
      Products: 'Products',
      Categories: 'Products/Categories',
      Customers: 'Customers',
      Orders: 'Orders',
      Variants: 'Products/Variants_Library',
      'Variant Types': 'Products/VartiantTypes'
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
