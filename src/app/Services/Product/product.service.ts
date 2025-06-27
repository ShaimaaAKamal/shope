import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';
import { catchError, concatMap, finalize, forkJoin, map, of, tap } from 'rxjs';
import { SharedService } from '../Shared/shared.service';
import { VariantMasterLookUP } from '../../Interfaces/variant-master-look-up';
import { ProductVariantMaster } from '../../Interfaces/product-variant-master';
import { VartiantType } from '../../Interfaces/vartiant-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private __SharedService=inject(SharedService);

  type = signal<string>('');
  getVariantDetailsData=signal<boolean>(false);
  usedProducts: Product[] = [];
  variantOptions = signal<VariantMasterLookUP[]>([]);
  productVariantOptions = signal<ProductVariantMaster[]>([]);
  variantTypes=signal<VartiantType[]>([]);
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

  //VariantTypeApi

  getVariantTypes() {
    this.loadingSignal.set(true);

    return this.__SharedService.getAllByPost<VartiantType>('GetVariantTypes', 'variant Types').pipe(
      tap({
        next: (data) => this.variantTypes.set([...data.data  || []]),
        complete: () => this.loadingSignal.set(false),

      })
    );
  }

  createVariantType(variant: VartiantType){
    this.loadingSignal.set(true);
    return this.__SharedService.createByPost<VartiantType>('CreateVariantType', variant, 'Variant Type').pipe(
     tap({
       next: (newVariant) => this.variantTypes.update(variants => this.commonService.addOrReplaceItemById(variants, newVariant['data'])),
       complete: () => this.loadingSignal.set(false),
     })
   );
   }

  deleteVariantType(id: number) {
    this.loadingSignal.set(true);
    return  this.__SharedService.deleteByPost<VartiantType>('DeleteVariantType', id, 'variant type').pipe(
        tap({
          next: () =>      this.variantTypes.update(variants => variants.filter(p => p.id !== id)),
          complete: () => this.loadingSignal.set(false),
        })
      );
  }
  updateVariantType(variant: VartiantType){
    if (!variant.id) {
    throw new Error('Variant Type ID is required for update.');
  }

   this.loadingSignal.set(true);
    const existingVariant = this.variantTypes().find(v => (v.nameEn === variant.nameEn ||  v.nameAr === variant.nameAr) && v.id != variant.id )
                    if (existingVariant) {
                      throw new Error(`Variant Type with this name already exist.`);
                    }

                    if( !variant.nameEn || !variant.nameAr) {
                      throw new Error(`Variant Name can't be empty.`);
                    }
    return this.__SharedService.updateByPost<VartiantType>('UpdateVariantType', variant, 'variant').pipe(
        tap({
          next: (updatedVariant) =>  {
                this.variantTypes.update(variants =>
                    variants.map(v => (v.id === updatedVariant.id ? updatedVariant : v))
                );},
          complete: () => this.loadingSignal.set(false),
        })
      );
  }
//Variant Api

getVariants() {
  this.loadingSignal.set(true);

  return this.__SharedService.getAllByPost<VariantMasterLookUP>('GetVariants', 'variants').pipe(
    tap({
      next: (data) => this.variantOptions.set([...data.data  || []]),
      complete: () => this.loadingSignal.set(false),

    })
  );
}

createVariant(variant: VariantMasterLookUP){
  this.loadingSignal.set(true);
  return this.__SharedService.createByPost<VariantMasterLookUP>('CreateVariant', variant, 'Variant').pipe(
   tap({
     next: (newVariant) => this.variantOptions.update(variants => this.commonService.addOrReplaceItemById(variants, newVariant['data'])),
     complete: () => this.loadingSignal.set(false),
   })
 );
 }

deleteVariant(id: number) {
  this.loadingSignal.set(true);
  return  this.__SharedService.deleteByPost<VariantMasterLookUP>('DeleteVariant', id, 'variant').pipe(
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
  return this.__SharedService.updateByPost<VariantMasterLookUP>('UpdateVariant', variant, 'variant').pipe(
      tap({
        next: (updatedVariant) =>  {
              this.variantOptions.update(variants =>
                  variants.map(v => (v.id === updatedVariant.id ? updatedVariant : v))
              );},
        complete: () => this.loadingSignal.set(false),
      })
    );
}
//ProductVarianTApi



getProductVariants() {
  this.loadingSignal.set(true);

  return this.__SharedService.getAllByPost<ProductVariantMaster>('GetProductVariants', 'Variants').pipe(
    tap({
      next: (data) => this.productVariantOptions.set([...data.data]),
      complete: () => this.loadingSignal.set(false),

    })
  );
}

createProductVariant(ProductVariant: ProductVariantMaster){
  this.loadingSignal.set(true);
  return this.__SharedService.createByPost<ProductVariantMaster>('CreateProductVariant', ProductVariant, 'Variant').pipe(
   tap({
     next: (newVariant) => this.productVariantOptions.update(variants => this.commonService.addOrReplaceItemById(variants, newVariant['data'])),
     complete: () => this.loadingSignal.set(false),
   })
 );
 }

deleteProductVariant(id: number) {
  this.loadingSignal.set(true);
  return  this.__SharedService.deleteByPost<ProductVariantMaster>('DeleteProductVariant', id, 'variant').pipe(
      tap({
        next: () =>      this.productVariantOptions.update(variants => variants.filter(p => p.id !== id)),
        complete: () => this.loadingSignal.set(false),
      })
    );
}


  updateProductVariant(variant: ProductVariantMaster){
    if (!variant.id) {
    throw new Error('Variant ID is required for update.');
  }

   this.loadingSignal.set(true);
    // const existingVariant = this.productVariantOptions().find(v => (v.nameEn === variant.nameEn ||  v.nameAr === variant.nameAr) && v.id != variant.id )
    //                 if (existingVariant) {
    //                   throw new Error(`Variant with this name already exist.`);
    //                 }
    //                 if (variant.variantDetails.length == 0) {
    //                   throw new Error(`Variant values can't be empty.`);
    //                 }

    //                 if( !variant.nameEn || !variant.nameAr) {
    //                   throw new Error(`Variant Name can't be empty.`);
    //                 }
    return this.__SharedService.updateByPost<ProductVariantMaster>('UpdateProductVariant', variant, 'variant').pipe(
        tap({
          next: (updatedVariant) =>  {
                this.productVariantOptions.update(variants =>
                    variants.map(v => (v.id === updatedVariant.id ? updatedVariant : v))
                );},
          complete: () => this.loadingSignal.set(false),
        })
      );
  }
  //Product Api
private init(): void {
  this.getVariantTypes().pipe(
    concatMap(() => this.getVariants()),
    concatMap(() => this.getProducts())
  ).subscribe({
    next: () => {
      console.log(this.variantTypes());
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

   getProduct(id:number){
     return this.__SharedService.getByIdByPost<Product>('GetProductById', id, 'product')
    }

getProducts() {
  this.loadingSignal.set(true);
  return this.__SharedService.getAllByPost<Product>('GetProducts', 'products').pipe(
    tap({
      next: (products) => {
        this.productsSignal.set(products.data || []);
      },
      complete: () => {
        this.loadingSignal.set(false);
      }
    })
  );
}

createProduct(product: Product) {
  this.loadingSignal.set(true); // only once
  const { id, ...productWithoutId } = product;
  return this.__SharedService.createByPost<Product>('CreateProduct', productWithoutId, 'product').pipe(
    tap({
      next: (newProduct) => {
        this.productsSignal.update(products =>
          products.filter(product => product.id !== id)
        );
        this.productsSignal.update(products =>
          this.commonService.addOrReplaceItemById(products, newProduct['data'])
        );
        this.type.set('');
        this.commonService.saveToStorage('products', this.sortProductsDesc(this.products()));
      },
      complete: () => {
        this.loadingSignal.set(false);
      }
    }),
    catchError(error => {
      console.error('❌ CreateProduct error:',  error);
      this.loadingSignal.set(false);
      return of(null);
    })
  );
}

updateProduct(product: Product) {
  if (!product.id) {
    throw new Error('Product ID is required for update.');
  }
    this.loadingSignal.set(true);
    // console.log('api updayed product ',product);
    return this.__SharedService.updateByPost<Product>('UpdateProduct', product, 'product').pipe(
        tap({
          next: (updatedProduct) =>  {
                  // console.log('updatedProduct',updatedProduct);
                 this.productsSignal.update(products =>
        products.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );},
          complete: () => this.loadingSignal.set(false),
        })
      );
  }

  deleteProduct(id: number) {
    this.loadingSignal.set(true);

      return  this.__SharedService.deleteByPost<Product>('DeleteProduct', id, 'product').pipe(
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
    this.__SharedService.deleteByPost<Product>('DeleteProduct', id, 'product')
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
      discountId:null,
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

