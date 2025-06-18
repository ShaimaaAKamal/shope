import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';
import { catchError, concatMap, finalize, forkJoin, map, of, tap } from 'rxjs';
import { SharedService } from '../Shared/shared.service';
import { VariantMasterLookUP } from '../../Interfaces/variant-master-look-up';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private __SharedService=inject(SharedService);

  type = signal<string>('');
  getVariantDetailsData=signal<boolean>(false);
  usedProducts: Product[] = [];

  variantOptions = signal<VariantMasterLookUP[]>([]);

  currentProduct = signal<Product>(this.getEmptyProduct());

  // Signals for state management
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Expose signals as readonly
  products = this.productsSignal.asReadonly() ;
  loading = this.loadingSignal.asReadonly();

  constructor(private commonService: CommonService) {
    this.init();
  }

//Variant Api

getVariants() {
  this.loadingSignal.set(true);

  return this.__SharedService.getAll<VariantMasterLookUP>('Variants', 'variants').pipe(
    tap({
      next: (data) => this.variantOptions.set([...data]),
      complete: () => this.loadingSignal.set(false),

    })
  );
}

createVariant(variant: VariantMasterLookUP){
   this.loadingSignal.set(true);
   return this.__SharedService.create<VariantMasterLookUP>('Variants', variant, 'Variant').pipe(
    tap({
      next: (newVariant) => this.variantOptions.update(variants => this.addOrReplaceItemById(variants, newVariant)),
      complete: () => this.loadingSignal.set(false),
    })
  );
  }

deleteVariant(id: number) {
    this.loadingSignal.set(true);
    return  this.__SharedService.delete<VariantMasterLookUP>('Variants', id, 'variant').pipe(
        tap({
          next: () =>      this.variantOptions.update(variants => variants.filter(p => p.id !== id)),
          complete: () => this.loadingSignal.set(false),
        })
      );
  }

updateVariant(variant: VariantMasterLookUP){
    if (!variant.id) {
    throw new Error('Variant ID is required for update.');
  }

   this.loadingSignal.set(true);
    const existingVariant = this.variantOptions().find(v => (v.nameEn === variant.nameEn ||  v.nameAr === variant.nameAr) && v.id != variant.id )
                    if (existingVariant) {
                      throw new Error(`Variant with this name already exist.`);
                    }
                    if (variant.variantDetails.length == 0) {
                      throw new Error(`Variant values can't be empty.`);
                    }

                    if( !variant.nameEn || !variant.nameAr) {
                      throw new Error(`Variant Name can't be empty.`);
                    }
    return this.__SharedService.update<VariantMasterLookUP>('Variants', variant.id, variant, 'variant').pipe(
        tap({
          next: (updatedVariant) =>  {
                this.variantOptions.update(variants =>
                    variants.map(v => (v.id === updatedVariant.id ? updatedVariant : v))
                );},
          complete: () => this.loadingSignal.set(false),
        })
      );
  }


  //Product Api
private init(): void {
  this.getVariants().pipe(
    concatMap(() => this.getProducts())
  ).subscribe({
    next: () => {
      this.handleLoadingAllowProducts();
    },
    error: (err) => {
      console.error('Error loading data:', err);
    }
  });
}
  private handleLoadingAllowProducts(){
    const sortedProducts=this.removeEmptyProduct(this.products());
    this.commonService.saveToStorage('products', sortedProducts);
    this.usedProducts = [...sortedProducts];
  }

  //Api calls
getProducts() {
  this.loadingSignal.set(true);
  return this.__SharedService.getAll<Product>('Products', 'products').pipe(
    tap({
      next: (products) => {
        this.productsSignal.set(products || []);
      },
      complete: () => {
        this.loadingSignal.set(false);
      }
    })
  );
}


createProduct(product: Product){
    this.loadingSignal.set(true);
    this.loadingSignal.set(true);
    const { id, ...productWithoutId } = product;
    // return this.__SharedService.create<Product>('Products', product, 'product').pipe(
        return this.__SharedService.create<Product>('Products', productWithoutId, 'product').pipe(

        tap({
          next: (newProduct) => {
            this.productsSignal.update(products =>
                products.filter(product => product.id !== id)
              );
              this.productsSignal.update(products => this.addOrReplaceItemById(products, newProduct));
              this.type.set('');
              this.commonService.saveToStorage('products',  this.sortProductsDesc(this.products()));
          },
          complete: () => this.loadingSignal.set(false),
        })
      );
  }
updateProduct(product: Product) {
  if (!product.id) {
    throw new Error('Product ID is required for update.');
  }
    this.loadingSignal.set(true);
    return this.__SharedService.update<Product>('Products', product.id, product, 'product').pipe(
        tap({
          next: (updatedProduct) =>  {
                 this.productsSignal.update(products =>
        products.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );},
          complete: () => this.loadingSignal.set(false),
        })
      );
  }

//   patchProduct(partialProduct: Partial<Product> & { id: number }) {
//   this.loadingSignal.set(true);

//   return this.__SharedService.patch<Product>('Products', partialProduct.id, partialProduct, 'product').pipe(
//     tap({
//       next: (updatedProduct) => {
//         this.productsSignal.update(products =>
//           products.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
//         );
//       },
//       complete: () => this.loadingSignal.set(false),
//     })
//   );
// }
   deleteProduct(id: number) {
    this.loadingSignal.set(true);

      return  this.__SharedService.delete<Product>('Products', id, 'product').pipe(
        tap({
          next: () =>  {
                 this.productsSignal.update(products => products.filter(p => p.id !== id));
                this.commonService.saveToStorage('products',  this.sortProductsDesc(this.products()));
                },
          complete: () => this.loadingSignal.set(false),
        })
      );
  }

deleteProducts(ids: number[]) {
  this.loadingSignal.set(true);

  const deleteRequests = ids.map(id =>
    this.__SharedService.delete<Product>('Products', id, 'product')
  );

  return forkJoin(deleteRequests).pipe(
    tap(() => {
      this.productsSignal.update(products =>
        // products.filter(product => !ids.includes(product.id))
        products.filter(product => product.id !== undefined && !ids.includes(product.id))
      );
      this.commonService.saveToStorage('products', this.sortProductsDesc(this.products()));
    }),
    finalize(() => {
      this.loadingSignal.set(false);
    }),
    map(() => void 0)
  );
}
  private addOrReplaceItemById<T extends { id?: number | string }>(array: T[], newItem: T): T[] {
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
    const exists = this.products().some(p => p.nameEn === newProduct.nameEn);
    if (exists) return false;
    const updated = [...this.products(), newProduct];
    const sorted = this.sortProductsDesc(updated);
    this.productsSignal.set(sorted);
    this.commonService.saveToStorage('products', sorted);
    return true;
  }

updateProductInfo(product: Product, actionType: string) {
  console.log(product);
  const result = this.commonService.checkDuplicateInArray(
    this.products(),
    p => p.id === product.id,
    product
  );

  if (!result.isDuplicate) {
    const action$ = actionType === 'add'
      ? this.createProduct(product)
      : this.updateProduct(product);

    return action$.pipe(
      map(() => ({ status: true, message: 'updated' })),
      catchError(error => of({ status: false, message: error?.message || 'Save failed' }))
    );
  }
  return of({ status: false, message: result.message ?? '' });
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
      p.nameEn.toLowerCase().includes(query) || p.nameAr.toLowerCase().includes(query)
    );
  }

  findProductByBarcode(barcode: string): Product[] {
    const code = barcode.trim().toLowerCase();
    return this.usedProducts.filter(p => p.barcode.toLowerCase() === code);
  }

  getProductLength(): number {
    return this.products()[0]?.id ?? 0;
  }

  //  getEmptyProduct(): Product {
  //   return {
  //     id: -1,
  //     name: '',
  //     nameAr: '',
  //     barcode: '',
  //     price: 0,
  //     // quantity: '0',
  //     quantity:0,
  //     tax: 0,
  //     status: 'Inactive',
  //     variants: [],
  //     variantsDetails: []
  //   };
  // }
   getEmptyProduct(): Product {
    return {
      id:-1,
      nameEn:'',
      nameAr:'',
      barcode:'',
      sku:'',
      isActive:true,
      price:0,
      quantity:0,
      enfinity:false,
      category:0,
      descriptionEn:'',
      descriptionAr:'',
    imageUrl:'',
    vatValue:0,
      discountId:0,
      comparePrice:0,
      isPriceAffecting:false,
      chargeTax:false,
      tax:0,
    };
  }

 removeEmptyProduct(products:Product[]){
    const filterProducts = products.filter(p => p.nameEn && p.price);
    const sortedProducts = this.sortProductsDesc(filterProducts);
     this.productsSignal.set(sortedProducts);
    return sortedProducts
}

//  private sortProductsDesc(products: Product[]): Product[] {
//     return [...products].sort((a, b) => b.id - a.id);
//   }

private sortProductsDesc(products: Product[]): Product[] {
  return [...products].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
}
}
