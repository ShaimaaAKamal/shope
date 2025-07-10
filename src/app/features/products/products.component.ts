import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { ProductService } from '../../Services/Product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonService } from '../../Services/CommonService/common.service';
import { ServiceInterface } from '../../Interfaces/service-interface';
import { CategoryService } from '../../Services/Category/category.service';
import { LanguageService } from '../../Services/Language/language.service';
import { FilterSection } from '../../Interfaces/filter-options';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: false
})
export class ProductsComponent {
  productService = inject(ProductService);
  private __CategoryService = inject(CategoryService);
  private __LanguageService=inject(LanguageService)
  private __Route=inject(ActivatedRoute);
  private __Router = inject(Router);
  private __CommonService=inject(CommonService);
  route=inject(ActivatedRoute);

  page=this.__CommonService.page;
  isRtl=this.__LanguageService.rtlClassSignal;
  queryParamsSignal= toSignal(this.__Route.queryParamMap);
  popupVisible = signal(false);
  products: Signal<Product[]>;
  newProduct!: Product;
  type = this.productService.type;
  checkedProducts:number[]=[];
  closeFilter:boolean=false;

  servicesList:ServiceInterface[]=[
    { label: 'Export', icon: 'fa-file-export', action: 'export' },
    { label: 'Sync', icon: 'fa-sync', action: 'sync' }
  ]
  cardDisplayDirection:string='catalog';

  categories = this. __CategoryService.categories;
  filterConfig= computed<FilterSection[]>(() => [
    {
      title: 'Category',
      collapseId: 'collapseCategory',
      fields: [
        {  operation:0,
          type: 'select',
          controlName: 'categoryId',
          label: 'Category',
          options: this.categories().map(c => ({
            label: this.isRtl() ? c.nameAr : c.nameEn,
            value: c.id
          }))
        }
      ]
    },
    {

      title: 'Price Range',
      collapseId: 'collapsePrice',
      fields: [
        { type: 'input', controlName: 'minPrice', label: 'Min Price', inputType: 'number', placeholder: 'Min' ,operation:7,filterName:'price'},
        { type: 'input', controlName: 'maxPrice', label: 'Max Price', inputType: 'number', placeholder: 'Max',operation:5 ,filterName:'price'}
      ]
    },
    {
      title: 'Product Status',
      collapseId: 'collapseStatus',
      fields: [
        {operation:0,
          type: 'radio',
          controlName: 'isActive',
          label: 'Product Status',
          options: [
            { label: 'Active', value: true },
            { label: 'Inactive', value: false }
          ]
        }
      ]
    },
    {
      title: 'Filter By',
      collapseId: 'collapseFilterBy',
      fields: [
        {
          type: 'checkbox',
          controlName: 'all',
          label: 'All',
          options: [
            { label: 'All', value: 'true' },
          ]
        },
        { operation:5,
          type: 'checkbox',
          controlName: 'inStock',
          label: 'In Stock',
          filterName: 'quantity',
          options: [
            { label: 'In Stock', value: true },
          ],
          filterValue:1
        },
        {
          operation:5,
          type: 'checkbox',
          controlName: 'newArrival',
          label: 'New Arrival',
          filterName: 'InsertedDate',
          options: [
            { label: 'New Arrival', value: 'true' },
          ],
          filterValue:new Date().toISOString()
        },
        {operation:0,
          type: 'checkbox',
          controlName: 'taxableProducts',
          label: 'Taxable products',
          filterName: 'chargesTax',
          options: [
            { label: 'Taxable products', value: 'true' },
          ]
        },

      ]
    }
  ]);

  constructor() {
    this.page.set('Products');

    effect(() => {
    const popup = this.queryParamsSignal()?.get('popup');
    this.popupVisible.set(popup === 'add_variant');
  });

    this.products = computed(() =>[...this.productService.products()]);
  }
  ngOnInit(): void {
    this.productService.paginationCtx.getStore('Products')?.initFromQueryParams(this.route);
  }
  onCheckboxChange(event: any, value: string) {
    const checked = event.target.checked;
  }

  addNew(_value: boolean): void {
    this.type.set('new');
    this.newProduct = this.productService.getEmptyProduct();
    this.productService.addNewProduct(this.newProduct);
  }

  deleteNewProduct(_del: boolean): void {
    const result = this.productService.deleteNewProduct();
    if (result) this.type.set('');
  }

  deleteSelected(_del: boolean): void {
         this.productService.deleteProducts(this.checkedProducts).subscribe();
  }

  closeAddVariantPopScreen(){
    this.popupVisible.set(false);
    this.__Router.navigateByUrl('Products');
  }
  checkedProductFn(event:any){
  const product:Product=event.product;
  const unchecked=event.checked
  const index = this.checkedProducts.findIndex(id => id === product.id);

  if (!unchecked) {
        if (index === -1 && product.id ) {
      this.checkedProducts.push(product.id);
    }
  } else {
    if (index !== -1) {
      this.checkedProducts.splice(index, 1);
    }
  }
}

handleServiceAction(action: any) {
  switch (action) {
    case 'export':
      console.log(action);
      break;
    case 'sync':
      console.log(action);
      break;
  }
}
handleDisplayDir(dir:string){
  this.cardDisplayDirection=dir;
}

applyFilters(event:any) {
  const filters = event;
  const store = this.productService.paginationCtx.getStore('Products');
if (store) {
  store.filters=filters;
  const savedSearchKey=this.__CommonService.getItemsFromStorage('searchKey','');
    const searchFn = this.productService.paginationCtx.getSearchFn('Products', 'nameEn',this.productService.getProducts.bind(this.productService));
    this.productService.paginationCtx.getStore('Products')?.setFetchFn(searchFn(savedSearchKey));
  this.productService.paginationCtx.getStore('Products')?.refresh();
}
  this.closeFilter=true;
  }
resetFilters() {
  // this.filterForm.reset();
}

  ngOnDestroy(): void {
    this.type.set('');
    this.productService.removeEmptyProductandSortPeroducts(this.products());
    const store= this.productService.paginationCtx.getStore('Products');
    if(store){
      store.resetPage();
    }
  }
}

