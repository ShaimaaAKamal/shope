import { Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';
import { VariantOption } from '../../Interfaces/variant-option';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // products = signal<Product[]>([]);
  type = signal<string>('');
  getVariantDetailsData=signal<boolean>(false);
  usedProducts: Product[] = [];
  defaultVariants=[
    { id: 1, name: 'size', nameAr: 'اللون', values: ['L','XL','XXL'] },
    { id: 2, name: 'color', nameAr: 'المقاس' ,values: ['red', 'blue', 'green'] },
  ];
  variantOptions = signal<VariantOption[]>([]);
  currentProduct = signal<Product>(this.getEmptyProduct());


  private apiUrl = 'http://localhost:3000/products'; // Replace with your API endpoint

  // Signals for state management
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expose signals as readonly
  products = this.productsSignal.asReadonly() ;
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(private commonService: CommonService,private http: HttpClient) {
    this.init();
    const storedVariants = this.commonService.getItemsFromStorage<any[]>('variantOptions', this.defaultVariants);
    this.variantOptions.set(storedVariants);
  }

  private async init(): Promise<void> {
  await this.getProducts();
  this.handleLoadingAllowProducts();
}
  private handleLoadingAllowProducts(){
    const sortedProducts=this.removeEmptyProduct(this.products());
    this.commonService.saveToStorage('products', sortedProducts);
    this.usedProducts = [...sortedProducts];
  }

  //Api calls
  async getProducts(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const data = await firstValueFrom(this.http.get<{ products: Product[] }>(this.apiUrl));
      this.productsSignal.set(data?.products || data || []);
    } catch (error: any) {
      this.errorSignal.set(error.message || 'Failed to fetch products');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createProduct(product: Product): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const newProduct = await firstValueFrom(
        this.http.post<Product>(this.apiUrl, product, { headers })
      );
      this.productsSignal.update(products => this.addOrReplaceItemById(products, newProduct));
      this.type.set('');
      this.commonService.saveToStorage('products',  this.sortProductsDesc(this.products()));
    } catch (error: any) {
       this.handleApiError(error,'Failed to create product')
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateProduct(product: Product): Promise<void> {

    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const updatedProduct = await firstValueFrom(
        this.http.put<Product>(`${this.apiUrl}/${product.id}`, product, { headers })
      );
      this.productsSignal.update(products =>
        products.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    } catch (error: any) {
          this.handleApiError(error,'Failed to update product');
    } finally {
      this.loadingSignal.set(false);
    }
  }

   async deleteProduct(id: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }));
      this.productsSignal.update(products => products.filter(p => p.id !== id));
      this.commonService.saveToStorage('products',  this.sortProductsDesc(this.products()));
    } catch (error: any) {
          this.handleApiError(error,'Failed to delete product');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteProducts(ids: number[]): Promise<void> {
  this.loadingSignal.set(true);
  this.errorSignal.set(null);

  try {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    await Promise.all(
      ids.map(id =>
        firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }))
      )
    );
    this.productsSignal.update(products =>
      products.filter(product => !ids.includes(product.id))
    );
    this.commonService.saveToStorage('products',  this.sortProductsDesc(this.products()));
  } catch (error: any) {
    this.handleApiError(error,'Failed to delete products');
  } finally {
    this.loadingSignal.set(false);
  }
}
 private handleApiError(error:any,message:string){
      console.log(error.message);
      this.errorSignal.set( message);
  }
  private addOrReplaceItemById<T extends { id: number | string }>(array: T[], newItem: T): T[] {
  const index = array.findIndex(item => item.id === newItem.id);
  const updated = [...array];

  if (index !== -1) {
    updated[index] = newItem;
  } else {
    updated.push(newItem);
  }

  return updated;
}

  //Helper Functions
  addNewProduct(newProduct: Product): boolean {
    const exists = this.products().some(p => p.name === newProduct.name);
    if (exists) return false;

    const updated = [...this.products(), newProduct];
    const sorted = this.sortProductsDesc(updated);
    this.productsSignal.set(sorted);
    this.commonService.saveToStorage('products', sorted);
    return true;
  }

  updateProductInfo(product: Product,actionType:string): {status:boolean,message:string} {
    const result = this.commonService.checkDuplicateInArray(
      this.products(),
      p => p.id === product.id,
      product
    );
    if (!result.isDuplicate) {
      if(actionType == 'add') this.createProduct(product);
        else this.updateProduct(product);
      return {status:true,message:'updated'};
    }
     return {status:false,message:result.message ?? ''};
  }


  updateProducts(products: Product[]): void {
    const sorted = this.sortProductsDesc(products);
    this.productsSignal.set(sorted);
    this.type.set('');
    this.commonService.saveToStorage('products', sorted);
  }
  updateVariants(variant:any){
      this.variantOptions.update(current => [...current, variant]);
      this.commonService.saveToStorage('variantOptions', this.variantOptions());
  }
  deleteProductByIndex(index: number): boolean {
    const current = [...this.products()];
    if (index < 0 || index >= current.length) return false;
    current.splice(index, 1);
    const sorted = this.sortProductsDesc(current);
    this.productsSignal.set(sorted);
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

 removeEmptyProduct(products:Product[]){
    const filterProducts = products.filter(p => p.name && p.price);
    const sortedProducts = this.sortProductsDesc(filterProducts);
     this.productsSignal.set(sortedProducts);
    return sortedProducts
}
 private sortProductsDesc(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.id - a.id);
  }

}
