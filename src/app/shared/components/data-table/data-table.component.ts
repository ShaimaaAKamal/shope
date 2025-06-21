import { ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, HostListener, inject, Input, NgZone, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { CommonService } from '../../../Services/CommonService/common.service';
import { SelectionType } from '@swimlane/ngx-datatable';
import { TemplateRefDirective } from '../../../Directives/template-ref-directive.directive';

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @ViewChildren(TemplateRefDirective) templates!: QueryList<TemplateRefDirective>;
  templateMap: { [key: string]: TemplateRef<any> } = {};
  private templatesInitialized = false;

  @ViewChild('checkbox', { static: true }) checkboxTemplate!: TemplateRef<any>;
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
  @ViewChild('table', { static: false }) table: any;

  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() del: boolean = false;
  @Output() rowsChanged = new EventEmitter<any[]>();

  displayedColumns: any[] = [];
  filteredRows: any[] = [];
  selected: any[] = [];

  tableVisible = true;
  page = 0;
  resizeCounter = 0;
  resizeDebounceTimer: any;
  isResizing = false;

  currentScreenWidth!: number;
  tableHeight: string = '100%';

  readonly MOBILE_BREAKPOINT = 768;
  readonly TABLET_BREAKPOINT = 1024;
  readonly Large_BreakPoint = 1400;

  rowHeight = 48;
  headerHeight = 56;
  footerHeight = 48;

  resizeObserver: ResizeObserver | null = null;

  selectionType = SelectionType.checkbox;
  private __CommonService=inject(CommonService);
  isCollapse=this.__CommonService.isCollapse;
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.handleResize();
    this.calculateTableHeight();
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    effect(() => {
      const isCollapsed = this.isCollapse();
      this.handleResize();
      this.calculateTableHeight();
    });
  }

  ngOnInit(): void {
    this.filteredRows = [...this.rows];
      this.currentScreenWidth = window.innerWidth;
      this.setupColumns();
  }

  ngAfterViewInit(): void {
    if (this.checkboxTemplate) {
      const checkboxColumn = this.columns.find(col => col.isCheckboxColumn);
      if (checkboxColumn) {
        checkboxColumn.cellTemplate = this.checkboxTemplate;
      }
      this.setupResizeObserver();
      this.calculateTableHeight();
      this.cdRef.detectChanges();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.templatesInitialized && this.templates && this.templates.length > 0) {
      this.templates.forEach(tpl => {
        if (tpl.name) {
          this.templateMap[tpl.name] = tpl.template;
        }
      });

      this.templatesInitialized = true;
      this.setupColumns();
      this.cdRef.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.handleRowsChange(changes['rows'].currentValue);
    }

    if (changes['del'] && this.del) {
      setTimeout(() => this.deleteSelected(), 0);
    }

    if (changes['columns']) {
      this.setupColumns();
    }
  }

  private handleRowsChange(newRows: any[]): void {
    this.filteredRows = [...newRows];
    this.selected = [];
    this.refreshTable();
  }

  private refreshTable(): void {
    if (this.table) {
      this.ngZone.run(() => {
        setTimeout(() => {
          this.table.recalculate();
          this.table.recalculateColumns();
        });
      });
    }
  }

  private setupResizeObserver(): void {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => {
          this.calculateTableHeight();
        });
      });
      this.resizeObserver.observe(this.tableContainer.nativeElement);
    }
  }

  calculateTableHeight(): void {
    if (!this.tableContainer) return;
    const viewportHeight = window.innerHeight;
    const container = this.tableContainer.nativeElement;
    const searchInput = container.querySelector('input');
    const searchInputHeight = searchInput ? searchInput.offsetHeight : 0;
    const marginBottom = 48;
    const remainingHeight =viewportHeight- container.offsetHeight - searchInputHeight - marginBottom;
    const minHeight = 300;

    this.tableHeight = `${Math.max(remainingHeight, minHeight)}px`;
    this.cdRef.detectChanges();
  }

  identityFn = (item: any): string => {
    if (item?.id) return `id_${item.id}`;
    if (item?._id) return `id_${item._id}`;
    if (item?.$$uid) return `uid_${item.$$uid}`;

    return `obj_${(item && typeof item === 'object') ?
      Object.values(item).join('_') :
      String(item)}`;
  };

  private handleResize = () => {

    this.isResizing = true;
    clearTimeout(this.resizeDebounceTimer);
    this.tableVisible = false;

    this.resizeDebounceTimer = setTimeout(() => {
      this.currentScreenWidth = window.innerWidth;
      this.setupColumns();
      this.cdRef.detectChanges();

      setTimeout(() => {
        this.resizeCounter++;
        this.tableVisible = true;
        this.isResizing = false;
        this.calculateTableHeight();
        this.cdRef.detectChanges();
      }, 100);
    }, 200);
  };

  private setupColumns(): void {
    if (!this.columns.length) return;

    const checkboxColumn = this.columns.find(col => col.isCheckboxColumn);
    if (checkboxColumn && this.checkboxTemplate) {
      checkboxColumn.cellTemplate = this.checkboxTemplate;
    }

    const otherColumns = this.columns.filter(col => !col.isCheckboxColumn);

    let baseColumns: any[];

    if (this.currentScreenWidth < this.MOBILE_BREAKPOINT) {
      baseColumns = otherColumns.filter(col => col.mobileVisible !== false).slice(0, 2);
    } else if (this.currentScreenWidth < this.TABLET_BREAKPOINT) {
      baseColumns = otherColumns.filter(col => col.tabletVisible !== false).slice(0, 3);
    }
    else if (this.currentScreenWidth < this.Large_BreakPoint) {
      baseColumns = otherColumns.filter(col => col.largeVisible !== false).slice(0, 4);}
       else {
      baseColumns = otherColumns;
    }

    this.displayedColumns = [
      ...(checkboxColumn ? [checkboxColumn] : []),
      ...baseColumns.map(col => {
        const newCol = { ...col };

        // switch (newCol.prop) {
        //   case 'customer':
        //     newCol.cellTemplate = this.templateMap['customerTemplate'];
        //     break;
        //   case 'salesPerson':
        //     newCol.cellTemplate = this.templateMap['sellerTemplate'];
        //     break;
        //   case 'grossTotal':
        //     newCol.cellTemplate = this.templateMap['priceTemplate'];
        //     break;
        //   case 'products':
        //     newCol.cellTemplate = this.templateMap['itemsTemplate'];
        //     break;
        //   case 'paymentMethods':
        //     newCol.cellTemplate = this.templateMap['paymentMethodsTemplate'];
        //     break;
        //    case 'time':
        //     newCol.cellTemplate = this.templateMap['timeTemplate'];
        //     break;
        // }

        return newCol;
      })
    ];
  }

  updateFilter(event: any): void {
    this.selected = [];
    const val = event.target.value.toLowerCase();
    this.filteredRows = (this.rows || []).filter(row => {
      return row && Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(val)
      );
    });
    this.page = 0;
    this.cdRef.detectChanges();
  }

  private deleteSelected(): void {
    this.filteredRows = this.rows.filter((row: any) => !this.selected.includes(row));
    this.selected = [];
    this.rowsChanged.emit(this.filteredRows);
  }

  onSelect(event: any): void {
    this.selected = [...event.selected];
  }

  onPage(event: any): void {
    this.page = event.offset;
  }

getValidPaymentMethods(paymentMethods: Record<string, any>) {
  return Object.entries(paymentMethods)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({ key, value }));
}
getDate(value:Date){
const date=new Date(value).toLocaleDateString();
  return date != 'Invalid Date'? date: 'N/A';
}
  ngOnDestroy(): void {
      clearTimeout(this.resizeDebounceTimer);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
  }
}
