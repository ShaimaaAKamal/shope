import { Component, computed, inject, Signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { ProductService } from '../../Services/Product/product.service';
import { ToastingMessagesService } from '../../Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: false
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private toastService = inject(ToastingMessagesService);

  products: Signal<Product[]>;
  newProduct!: Product;
  type = this.productService.type;

  constructor() {
    this.products = computed(() =>
      [...this.productService.products()].sort((a, b) => b.id - a.id)
    );
  }

  addNew(_value: boolean): void {
    this.type.set('new');
    this.newProduct = this.productService.getEmptyProduct();
    this.newProduct.id = this.products().length + 1;
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
    console.log('deleteSelected');
  }
}

