import { signal, WritableSignal, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';
import { Filter } from '../../Interfaces/filter';
import { Sort } from '../../Interfaces/sort';
import { CommonService } from '../../Services/CommonService/common.service';

export class PaginationStore<T> {
  private router=inject(Router);
  private route=inject(ActivatedRoute);
  private __CommonService=inject(CommonService);

  private pageSizeSubject = new BehaviorSubject<{ page: number; size: number }>({
    page: 1,
    size: 12
  });

  items: WritableSignal<T[]>;
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(12);
  filters:Filter[]=[];
  sorts:Sort[]=[];
  private dynamicFetchFn: (page: number, size: number,filters:Filter[],sorts:Sort[]) => Observable<{ data: T[]; totalCount: number }>;
  private hasSetInitialTotal = false;



  constructor(
    initialFetchFn: (page: number, size: number,filter:Filter[],sorts:Sort[]) => Observable<{ data: T[]; totalCount: number }>,
    key:string,
    externalItemsSignal?: WritableSignal<T[]>
  ) {
    this.items = externalItemsSignal ?? signal<T[]>([]);
    this.dynamicFetchFn = initialFetchFn;
    this.pageSizeSubject
      .pipe(switchMap(({ page, size }) => this.dynamicFetchFn(page, size,this.filters,this.sorts)))
      .subscribe(result => {
        this.items.set(result.data);
        this.setTotalItems(result.totalCount);
        this.currentPage.set(this.pageSizeSubject.value.page);
        this.pageSize.set(this.pageSizeSubject.value.size);
      });

    effect(() => {
      const totalItems = this.totalItems();
      const pageSize = this.pageSize();
      const currentPage = this.currentPage();

      if (!this.hasSetInitialTotal && totalItems > 0) {
        this.hasSetInitialTotal = true;
      }

      if (!this.hasSetInitialTotal) return;

      const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
      if (currentPage > totalPages) this.goToPage(totalPages);
      else if (currentPage < 1) this.goToPage(1);
    });
  }

  initFromQueryParams(route: ActivatedRoute) {
    route.queryParamMap
      .pipe(take(1))
      .subscribe(params => {
        const page = Number(params.get('page')) || 1;
        const size = Number(params.get('size')) || 12;
        this.currentPage.set(page);
        this.pageSize.set(size);
        this.pageSizeSubject.next({ page, size });
      });
  }

  goToPage(page: number) {
    const current = this.pageSizeSubject.value.page;
    if (page !== current) {
      this.updateQueryParams({ page,size: this.pageSizeSubject.value.size });
      this.pageSizeSubject.next({ page, size: this.pageSizeSubject.value.size });
    }
  }

  setPageSize(size: number) {
    const currentSize = this.pageSizeSubject.value.size;
    const currentPage = this.pageSizeSubject.value.page;
    if (size !== currentSize) {
      this.updateQueryParams({ page: currentPage, size});
      this.pageSizeSubject.next({ page: currentPage, size });
    }
  }

  setTotalItems(count: number) {
    if (this.totalItems() !== count) {
      this.totalItems.set(count);
    }
  }
  private updateQueryParams(params: { page?: number; size?: number }) {
    const currentParams = this.route.snapshot.queryParams;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...currentParams,
        ...params
      },
      queryParamsHandling: 'merge',
    });
  }

  resetPage() {
    this.currentPage.set(1);
    this.refresh();
  }



  refresh() {
    this.pageSizeSubject.next({
      page: this.currentPage(),
      size: this.pageSize()
    });
  }
  setFetchFn(fn: (page: number, size: number,filters:Filter[],sorts:Sort[]) => Observable<{ data: T[]; totalCount: number }>) {
    this.dynamicFetchFn = fn;
    this.resetPage();
  }
}

