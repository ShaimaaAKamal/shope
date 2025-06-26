import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { ProductService } from '../../Services/Product/product.service';
import { ToastingMessagesService } from '../../Services/ToastingMessages/toasting-messages.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonService } from '../../Services/CommonService/common.service';
import { ServiceInterface } from '../../Interfaces/service-interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../Services/Category/category.service';
import { LanguageService } from '../../Services/Language/language.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: false
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private __CategoryService = inject(CategoryService);
  private __LanguageService=inject(LanguageService)
  private toastService = inject(ToastingMessagesService);
  private __Route=inject(ActivatedRoute);
  private __Router = inject(Router);
  isRtl=this.__LanguageService.rtlClassSignal;
  queryParamsSignal= toSignal(this.__Route.queryParamMap);
  popupVisible = signal(false);
  products: Signal<Product[]>;
  newProduct!: Product;
  type = this.productService.type;
  checkedProducts:number[]=[];
  closeFilter:boolean=false;
  // closeFilter=signal<boolean>(false);

  servicesList:ServiceInterface[]=[
    { label: 'Export', icon: 'fa-file-export', action: 'export' },
    { label: 'Sync', icon: 'fa-sync', action: 'sync' }
  ]
  cardDisplayDirection:string='catalog';

  filterForm: FormGroup;
  filterOptions = [
    { label: 'All', value: 'all', controlName: 'all' },
    { label: 'In Stock', value: 'inStock', controlName: 'inStock' },
    { label: 'On Sale', value: 'onSale', controlName: 'onSale' },
    { label: 'New Arrival', value: 'newArrival', controlName: 'newArrival' },
    { label: 'Taxable products', value: 'taxableProducts', controlName: 'taxableProducts' },
    { label: 'Sold out products', value: 'soldOutProducts', controlName: 'soldOutProducts' },
    { label: 'Unpriced products', value: ' unpricedProducts', controlName: 'unpricedProducts' },
    { label: 'Uncategorized Products', value: ' uncategorizedProducts', controlName: 'uncategorizedProducts' },


  ];
  categories = this. __CategoryService.categories;
  constructor(private __CommonService:CommonService,private fb: FormBuilder) {
     effect(() => {
    const popup = this.queryParamsSignal()?.get('popup');
    this.popupVisible.set(popup === 'add_variant');
  });

    this.products = computed(() =>
    [...this.productService.products()].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    );

    this.filterForm = this.fb.group({
      category: [''],
      minPrice: [''],
      maxPrice: [''],
      inStock: [false],
      onSale: [false],
      newArrival: [false],
      uncategorizedProducts: [false],
      unpricedProducts: [false],
      soldOutProducts: [false],
      taxableProducts: [false],
      all: [false],
    });
  }

  onCheckboxChange(event: any, value: string) {
    const checked = event.target.checked;
  }

  addNew(_value: boolean): void {
    this.type.set('new');
    this.newProduct = this.productService.getEmptyProduct();
    this.newProduct.id = this.__CommonService.getId();
    this.productService.addNewProduct(this.newProduct);
  }

  deleteNewProduct(_del: boolean): void {
    const result = this.productService.deleteProductByIndex(0);
    if (result) this.type.set('');

    this.toastService.showToast(
      result ? 'Product has been deleted successfully' : 'Product could not be deleted',
      result ? 'success' : 'error'
    );
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
    // if (index === -1 ) {
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

applyFilters() {
  const filters = this.filterForm.value;
  this.closeFilter=true;
  console.log(filters);
  console.log('send apu request to get filter data');
  }

// resetFilter(){
//     this.closeFilter=false;
//   }
resetFilters() {
  this.filterForm.reset();
}

  ngOnDestroy(): void {
    this.type.set('');
    this.productService.removeEmptyProduct(this.products());
  }
}

