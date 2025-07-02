import { signal, WritableSignal, effect } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

export class PaginationStore<T> {
  private pageSizeSubject = new BehaviorSubject<{ page: number; size: number }>({
    page: 1,
    size: 10,
  });

  items = signal<T[]>([]);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);
  private hasSetInitialTotal = false;

  constructor(
    private fetchFn: (page: number, size: number) => Observable<{ data: T[]; totalCount: number }>,
    private storageKey = '',
    externalItemsSignal?: WritableSignal<T[]>
  ) {
    this.items = externalItemsSignal ?? signal<T[]>([]);

    const storedPage = Number(localStorage.getItem(this.key('page')));
    const storedSize = Number(localStorage.getItem(this.key('size')));
    const initialPage = storedPage || 1;
    const initialSize = storedSize || 10;

    this.currentPage.set(initialPage);
    this.pageSize.set(initialSize);

    this.pageSizeSubject.next({ page: initialPage, size: initialSize });

    this.pageSizeSubject
      .pipe(switchMap(({ page, size }) => this.fetchFn(page, size)))
      .subscribe(result => {
        if (JSON.stringify(this.items()) !== JSON.stringify(result.data)) {
          this.items.set(result.data);
        }

        this.setTotalItems(result.totalCount);

        this.currentPage.set(this.pageSizeSubject.value.page);
        this.pageSize.set(this.pageSizeSubject.value.size);
      });

    // Effect to keep currentPage within valid range once totalItems is set
    effect(() => {
      const totalItems = this.totalItems();
      const pageSize = this.pageSize();
      const currentPage = this.currentPage();

      if (!this.hasSetInitialTotal && totalItems > 0) {
        this.hasSetInitialTotal = true;
      }

      if (!this.hasSetInitialTotal) return;

      const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

      if (currentPage > totalPages) {
        this.goToPage(totalPages);
      } else if (currentPage < 1) {
        this.goToPage(1);
      }
    });
  }

  private key(suffix: string) {
    return `pagination-${this.storageKey}-${suffix}`;
  }

  goToPage(page: number) {
    const current = this.pageSizeSubject.value.page;
    if (page !== current) {
      localStorage.setItem(this.key('page'), page.toString());
      this.pageSizeSubject.next({ page, size: this.pageSizeSubject.value.size });
    }
  }

  setPageSize(size: number) {
    const currentSize = this.pageSizeSubject.value.size;
    if (size !== currentSize) {
      localStorage.setItem(this.key('size'), size.toString());
      this.pageSizeSubject.next({ page: 1, size }); // reset to page 1 on size change
    }
  }

  setTotalItems(count: number) {
    if (this.totalItems() !== count) {
      this.totalItems.set(count);
    }
  }

  refresh() {
    this.pageSizeSubject.next({
      page: this.currentPage(),
      size: this.pageSize()
    });
  }
}
