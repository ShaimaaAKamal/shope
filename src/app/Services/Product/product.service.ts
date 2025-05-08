import { Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';
import { VariantOption } from '../../Interfaces/variant-option';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = signal<Product[]>([]);
  type = signal<string>('');
  usedProducts: Product[] = [];
  variantOptions = signal<VariantOption[]>([
    { id: 1, name: 'size', nameAr: 'اللون', values: ['L','XL','XXL'] },
    { id: 2, name: 'color', nameAr: 'المقاس' ,values: ['red', 'blue', 'green'] },
  ]);
  currentProduct = signal<Product>(this.getEmptyProduct());

  constructor(private commonService: CommonService) {
    const storedProducts = this.commonService.getItemsFromStorage<Product[]>('products', [])
      .filter(p => p.name && p.price);

    const sortedProducts = this.sortProductsDesc(storedProducts);
    this.products.set(sortedProducts);
    this.commonService.saveToStorage('products', sortedProducts);

    this.usedProducts = [...sortedProducts];
  }

  addNewProduct(newProduct: Product): boolean {
    const exists = this.products().some(p => p.name === newProduct.name);
    if (exists) return false;

    const updated = [...this.products(), newProduct];
    const sorted = this.sortProductsDesc(updated);
    this.products.set(sorted);
    this.commonService.saveToStorage('products', sorted);
    return true;
  }

  updateProductInfo(product: Product): boolean {
    const updatedArray = this.commonService.updateItemInArray(
      this.products(),
      p => p.id === product.id,
      product
    );

    if (updatedArray.updated) {
      this.updateProducts(updatedArray.array);
      return true;
    }
    return false;
  }

  updateProducts(products: Product[]): void {
    const sorted = this.sortProductsDesc(products);
    this.products.set(sorted);
    this.type.set('');
    this.commonService.saveToStorage('products', sorted);
  }

  deleteProductByIndex(index: number): boolean {
    const current = [...this.products()];
    if (index < 0 || index >= current.length) return false;

    current.splice(index, 1);
    const sorted = this.sortProductsDesc(current);
    this.products.set(sorted);
    this.commonService.saveToStorage('products', sorted);
    return true;
  }

  findProductByName(name: string): Product[] {
    const query = name.trim().toLowerCase();
    return this.usedProducts.filter(p =>
      p.name.toLowerCase().includes(query) || p.nameAr.toLowerCase().includes(query)
    );
  }

  findProductByBarcode(barcode: string): Product[] {
    const code = barcode.trim().toLowerCase();
    return this.usedProducts.filter(p => p.barcode.toLowerCase() === code);
  }

  getProductLength(): number {
    return this.products()[0]?.id ?? 0;
  }

  private sortProductsDesc(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.id - a.id);
  }

   getEmptyProduct(): Product {
    return {
      id: -1,
      name: '',
      nameAr: '',
      barcode: '',
      price: 0,
      quantity: '0',
      tax: 0,
      status: 'Inactive',
      variants: [],
      variantsDetails: []
    };
  }
}
