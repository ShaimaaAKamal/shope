import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';
import { catchError, concatMap, finalize, forkJoin, map, Observable, of, tap } from 'rxjs';
import { SharedService } from '../Shared/shared.service';
import { VariantMasterLookUP } from '../../Interfaces/variant-master-look-up';
import { ProductVariantMaster } from '../../Interfaces/product-variant-master';
import { VartiantType } from '../../Interfaces/vartiant-type';
import { HandleActualApiInvokeService } from '../HandleActualApiInvoke/handle-actual-api-invoke.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private __SharedService=inject(SharedService);
private __HandleActualApiInvokeService=inject(HandleActualApiInvokeService);
  type = signal<string>('');
  getVariantDetailsData=signal<boolean>(false);
  usedProducts: Product[] = [];
  variantOptions = signal<VariantMasterLookUP[]>([]);
  productVariantOptions = signal<ProductVariantMaster[]>([]);
  variantTypes=signal<VartiantType[]>([]);
  currentProduct = signal<Product>(this.getEmptyProduct());

  // Signals for state management
  private productsSignal = signal<Product[]>([]);
  products = this.productsSignal.asReadonly();
  private loadingSignal = signal<boolean>(false);

  // Expose signals as readonly
;
  loading = this.loadingSignal.asReadonly();

  constructor(private commonService: CommonService) {
    this.init();
  }

  //VariantTypeApi

  getVariantTypes(body?: any): Observable<VartiantType[]> {
      return this.__HandleActualApiInvokeService.getEntities<VartiantType>('GetVariantTypes', 'variant Types',this.variantTypes, body)
    }

  createVariantType(variant: VartiantType) {
    return this.__HandleActualApiInvokeService.createEntity<VartiantType>(
      'CreateVariantType',
      variant,
      'Variant Type',
      this.variantTypes
    );
  }

  deleteVariantType(id: number) {
    return this.__HandleActualApiInvokeService.deleteEntity<VartiantType>(
      'DeleteVariantType',
      id,
      'variant type',
      this.variantTypes,
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


getVariants(body?: any): Observable<VariantMasterLookUP[]> {
  return this.__HandleActualApiInvokeService.getEntities<VariantMasterLookUP>('GetVariants', 'variants',this.variantOptions, body)
}

createVariant(variant: VariantMasterLookUP){
  return this.__HandleActualApiInvokeService.createEntity<VariantMasterLookUP>(
    'CreateVariant',
    variant,
    'Variant',
    this.variantOptions
  );
}

deleteVariant(id: number) {
  return this.__HandleActualApiInvokeService.deleteEntity<VariantMasterLookUP>(
    'DeleteVariant',
    id,
    'variant',
    this.variantOptions,
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

getProductVariants(body?: any): Observable<ProductVariantMaster[]> {
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
  //Product Api
private init(): void {
  this.getVariantTypes().pipe(
    concatMap(() => this.getVariants()),
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
    const sortedProducts=this.removeEmptyProductandSortPeroducts(this.products());
    this.commonService.saveToStorage('products', sortedProducts);
    this.usedProducts = [...sortedProducts];
  }

  //Api calls

   getProduct(id:number){
    return this.__HandleActualApiInvokeService.getEntityById<Product>('GetProductById', id, 'product');
    }

getProducts(body?: any): Observable<Product[]> {
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
        this.sortProductsDesc(this.commonService.addOrReplaceItemById(products, newProduct))
      );
      this.type.set('');
      this.commonService.saveToStorage('products', this.sortProductsDesc(this.products()));
    }
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

  deleteNewProduct():boolean{
    const current = [...this.products()];
    current.shift();
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
    const sortedProducts = this.sortProductsDesc(filterProducts);
     this.productsSignal.set(sortedProducts);
    return sortedProducts
}

private sortProductsDesc(products: Product[]): Product[] {
  return [...products].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
}
}

