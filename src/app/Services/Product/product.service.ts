import {  inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';
import { catchError, finalize, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { SharedService } from '../Shared/shared.service';
import { VariantMasterLookUP } from '../../Interfaces/variant-master-look-up';
import { ProductVariantMaster } from '../../Interfaces/product-variant-master';
import { VartiantType } from '../../Interfaces/vartiant-type';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';
import { PaginationContextService } from '../PaginationContext/pagination-context.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private __SharedService=inject(SharedService);
private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
private commonService = inject(CommonService);
paginationCtx=inject(PaginationContextService);
  type = signal<string>('');
  getVariantDetailsData=signal<boolean>(false);
  usedProducts: Product[] = [];
  variantOptions = signal<VariantMasterLookUP[]>([]);
  productVariantOptions = signal<ProductVariantMaster[]>([]);
  variantTypes=signal<VartiantType[]>([]);
  currentProduct = signal<Product>(this.getEmptyProduct());

  // Signals for state management
  productsSignal = signal<Product[]>([]);
  products = this.productsSignal.asReadonly();
  private loadingSignal = signal<boolean>(false);
  loading = this.loadingSignal.asReadonly();


  constructor(    ) {
    this.paginationCtx.registerEntity<Product>(
      'Products',
      this.getProducts.bind(this),
      this.productsSignal,
      this.handleLoadingAllowProducts.bind(this)
    );

  this.paginationCtx.registerEntity<VariantMasterLookUP>(
    'Variants',
    this.getVariants.bind(this),
    this.variantOptions
  );

this.paginationCtx.registerEntity<VartiantType>(
    'Variant Types',
    this.getVariantTypes.bind(this),
    this.variantTypes
  );
  }
  getVariantTypes(body?: any): Observable<{data:VartiantType[],totalCount:number}> {
    return this.__HandleActualApiInvokeService.getEntities<VartiantType>('GetVariantTypes', 'variant Types',this.variantTypes, body)
  }

  createVariantType(variant: VartiantType) {
    return this.__HandleActualApiInvokeService.createEntity<VartiantType>(
      'CreateVariantType',
      variant,
      'Variant Type',
      this.variantTypes
    ).pipe(
      tap(value => {
        this.paginationCtx.getStore('Variant Types')?.refresh();
      })
    );
  }

  deleteVariantType(id: number) {
    return this.__HandleActualApiInvokeService.deleteEntity<VartiantType>(
      'DeleteVariantType',
      id,
      'variant type',
      this.variantTypes,
    ).pipe(
      tap(value => {
        this.paginationCtx.getStore('Variant Types')?.refresh();
      })
    );
  }

  updateVariantType(variant: VartiantType) {
    return this.__HandleActualApiInvokeService.updateEntity<VartiantType>(variant, {
      apiMethod: 'UpdateVariantType',
      signal: this.variantTypes,
      entityName: 'Variant Type',
      duplicateCheck: (v) =>
        this.variantTypes().some(x =>
          (x.nameEn === v.nameEn || x.nameAr === v.nameAr) && x.id !== v.id
        ),
      additionalValidation: () => {
        if (!variant.nameEn || !variant.nameAr) {
          throw new Error(`Variant Name can't be empty.`);
        }
      }
    });
  }

//Variant Api

getVariants(body?: any): Observable<{data:VariantMasterLookUP[],totalCount:number}>{
  return this.__HandleActualApiInvokeService.getEntities<VariantMasterLookUP>('GetVariants', 'variants',this.variantOptions, body)
}

createVariant(variant: VariantMasterLookUP){
  return this.__HandleActualApiInvokeService.createEntity<VariantMasterLookUP>(
    'CreateVariant',
    variant,
    'Variant',
    this.variantOptions
  ).pipe(
    tap(value => {
      this.paginationCtx.getStore('Variants')?.refresh();
    })
  );
}

deleteVariant(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<VariantMasterLookUP>(
    'DeleteVariant',
    id,
    'variant',
    this.variantOptions,
  ).pipe(
    tap(value => {
      this.paginationCtx.getStore('Variants')?.refresh();
    })
  );
}
updateVariant(variant: VariantMasterLookUP) {
  return this.__HandleActualApiInvokeService.updateEntity<VariantMasterLookUP>(variant, {
    apiMethod: 'UpdateVariant',
    signal: this.variantOptions,
    entityName: 'Variant',
    duplicateCheck: (v) =>
      this.variantOptions().some(x =>
        (x.nameEn === v.nameEn || x.nameAr === v.nameAr) && x.id !== v.id
      ),
    additionalValidation: () => {
      if (!variant.nameEn || !variant.nameAr) {
        throw new Error(`Variant Name can't be empty.`);
      }
      if (variant.variantDetails.length === 0) {
        throw new Error(`Variant values can't be empty.`);
      }
    }
  });
}

getVariant(id:number){
  return this.__HandleActualApiInvokeService.getEntityById<VariantMasterLookUP>('GetVariant', id, 'variant');
  }

getProductVariants(body?: any): Observable<{data:ProductVariantMaster[],totalCount:number}>{
  return this.__HandleActualApiInvokeService.getEntities<ProductVariantMaster>('GetProductVariants', 'Variants',this.productVariantOptions, body)
}

createProductVariant(ProductVariant: ProductVariantMaster){
  return this.__HandleActualApiInvokeService.createEntity<ProductVariantMaster>(
    'CreateProductVariant',
    ProductVariant,
    'Variant',
    this.productVariantOptions
  );
}


deleteProductVariant(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<ProductVariantMaster>(
    'DeleteProductVariant',
    id,
    'variant',
    this.productVariantOptions,
  );
}


updateProductVariant(variant: ProductVariantMaster) {
    return this.__HandleActualApiInvokeService.updateEntity<ProductVariantMaster>(variant, {
      apiMethod: 'UpdateProductVariant',
      signal: this.productVariantOptions,
      entityName: 'Variant',
      // If needed, you can uncomment and add duplicateCheck or additionalValidation
      // duplicateCheck: (v) =>
      //   this.productVariantOptions().some(x =>
      //     (x.nameEn === v.nameEn || x.nameAr === v.nameAr) && x.id !== v.id
      //   ),
      // additionalValidation: () => {
      //   if (!variant.nameEn || !variant.nameAr) {
      //     throw new Error(`Variant Name can't be empty.`);
      //   }
      //   if (variant.variantDetails.length === 0) {
      //     throw new Error(`Variant values can't be empty.`);
      //   }
      // }
    });
  }
updateProductVariants(variants: ProductVariantMaster[]): Observable<ProductVariantMaster[] | null> {
    if (!variants.length) return of(null);

    this.loadingSignal.set(true);

    const updateRequests = variants.map(variant => {
      return this.__SharedService.updateByPost<ProductVariantMaster>(
        'UpdateProductVariant',
        variant,
        'variant'
      );
    });

    return forkJoin(updateRequests).pipe(
      tap(() => {
        this.productVariantOptions.update(existing =>
          existing.map(pv => {
            const updated = variants.find(u => u.id === pv.id);
            return updated ? updated : pv;
          })
        );
      }),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  private handleLoadingAllowProducts(products:Product[]){
    const sortedProducts=this.removeEmptyProductandSortPeroducts(products);
    this.commonService.saveToStorage('products', sortedProducts);
      this.usedProducts = [...sortedProducts];
    return sortedProducts;
  }
  //Api calls

   getProduct(id:number){
    return this.__HandleActualApiInvokeService.getEntityById<Product>('GetProductById', id, 'product');
    }

getProducts(body?: any): Observable<{data:Product[],totalCount:number}> {
  return this.__HandleActualApiInvokeService.getEntities<Product>('GetProducts', 'products',this.productsSignal, body)
}


createProduct(product: Product) {
  const { id, ...productWithoutId } = product;
  return this.__HandleActualApiInvokeService.createEntity<Product>(
    'CreateProduct',
    productWithoutId,
    'product',
    this.productsSignal,
    (newProduct) => {
      this.productsSignal.update(products =>
        products.filter(p => p.id !== id)
      );
      this.productsSignal.update(products =>
      (this.commonService.addOrReplaceItemById(products, newProduct).slice(0, this.paginationCtx.getStore('Products')?.pageSize()))
      );
      this.type.set('');
      this.commonService.saveToStorage('products', this.sortProductsDesc(this.products()));
    }
  ).pipe(
    tap(value => {
      this.paginationCtx.getStore('Products')?.refresh();
    })
  );
}

updateProduct(product: Product) {
  return this.__HandleActualApiInvokeService.updateEntity<Product>(product, {
    apiMethod: 'UpdateProduct',
    signal: this.productsSignal,
    entityName: 'Product',
  });
}

  deleteProduct(id: number) {
    return this.__HandleActualApiInvokeService.deleteEntity<Product>(
      'DeleteProduct',
      id,
      'product',
      this.productsSignal,
      (updatedList) => {
        this.commonService.saveToStorage('products', this.sortProductsDesc(updatedList));
      }
    ).pipe(
      tap(value => {
        this.paginationCtx.getStore('Products')?.refresh();
      })
    );
  }

deleteProducts(ids: number[]) {
  return this.__HandleActualApiInvokeService.deleteEntities<Product>(
    'DeleteProduct',
    ids,
    'product',
    this.productsSignal,
    (updatedList) => {
      this.commonService.saveToStorage('products', this.sortProductsDesc(updatedList));
    }
  );
}
  //Helper Functions
  addNewProduct(newProduct: Product): boolean {
    const exists = this.products().some(p => p.nameEn === newProduct.nameEn);
    if (exists) return false;
    const updated = [newProduct,...this.products()];
    this.productsSignal.set(updated);
    this.commonService.saveToStorage('products', updated);
    return true;
  }

// updateProductInfo(product: Product, actionType: string) {
//   const result = this.commonService.checkDuplicateInArray(
//     this.products()
//     p => p.id === product.id,
//     product
//   );

//   if (!result.isDuplicate) {
//     const action$ = actionType === 'add'
//       ? this.createProduct(product)
//       : this.updateProduct(product);

//     return action$.pipe(
//       map(() => ({ status: true, message: 'updated' })),
//       catchError(error => of({ status: false, message: error?.message || 'Save failed' }))
//     );
//   }
//   return of({ status: false, message: result.message ?? '' });
// }

updateProductInfo(product: Product, actionType?: string) {
  return this.getProduct(product.id!).pipe(
    switchMap(existingProduct => {
      if (existingProduct) {
        // Product exists, so update it
        return this.updateProduct(product).pipe(
          map(() => ({ status: true, message: 'updated' })),
          catchError(error => of({ status: false, message: error?.message || 'Update failed' }))
        );
      } else {
        return this.createProduct(product).pipe(
          map(() => ({ status: true, message: 'created' })),
          catchError(error => of({ status: false, message: error?.message || 'Create failed' }))
        );
      }
    }),
    catchError(() => {
      return this.createProduct(product).pipe(
        map(() => ({ status: true, message: 'created' })),
        catchError(error => of({ status: false, message: error?.message || 'Create failed' }))
      );
    })
  );
}

deleteNewProduct():boolean{
    const current = [...this.products()];
    current.shift();

    this.productsSignal.set(current);
    this.commonService.saveToStorage('products', current);
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

 removeEmptyProductandSortPeroducts(products:Product[]){
    const filterProducts = products.filter(p => p.nameEn && p.nameAr);
    return filterProducts
}

private sortProductsDesc(products: Product[]): Product[] {
  return [...products].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
}
}

