import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { ProductService } from '../../Services/Product/product.service';
import { ToastingMessagesService } from '../../Services/ToastingMessages/toasting-messages.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonService } from '../../Services/CommonService/common.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: false
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private toastService = inject(ToastingMessagesService);
  private __Route=inject(ActivatedRoute);
  private __Router = inject(Router);

  queryParamsSignal= toSignal(this.__Route.queryParamMap);
  popupVisible = signal(false);
  products: Signal<Product[]>;
  newProduct!: Product;
  type = this.productService.type;
  checkedProducts:number[]=[];

  constructor(private __CommonService:CommonService) {
     effect(() => {
    const popup = this.queryParamsSignal()?.get('popup');
    this.popupVisible.set(popup === 'add_variant');
  });

    this.products = computed(() =>
      // [...this.productService.products()].sort((a, b) => b.id - a.id)
    [...this.productService.products()].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    );
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
  ngOnDestroy(): void {
    this.type.set('');
    this.productService.removeEmptyProduct(this.products());
  }
}

