import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 products=signal<Product[]>([]);
 usedProducts!:Product[]

  constructor(private __CommonService:CommonService) {
  this.products.set(this.__CommonService.getItemsFromStorage<Product[]>('products',[]));
  this.usedProducts=[...this.products()];
}

addNewProduct(newProduct : Product){
const exists = this.products().some((product:Product) => product.name === newProduct.name  );
if (!exists) {
 this.products.update(prev => [...prev, newProduct]);
  this.__CommonService.saveToStorage('products',this.products().slice().sort((a, b) => b.id - a.id));
  return true;
} else {
  return false;
}
}

updateProductInfo(product:Product ){
 const result=this.__CommonService.updateItemInArray(this.products(),p => p.id === product.id,product);

 if(result.updated){ this.updateProducts(result.array) ;return true;}
 else return false;
}

getProductLength():number{
  const sortedProducts = this.products().sort((a, b) => b.id - a.id);
   const firstId = sortedProducts[0]?.id ?? 0;
   return firstId;
}
updateProducts(products:Product[]){
  this.products.set([...products]);
  this.__CommonService.saveToStorage('products',products.slice().sort((a, b) => b.id - a.id));
}

 deleteProductByIndex(index:number):boolean{
    const currentProducts = structuredClone(this.products().slice().sort((a, b) => b.id - a.id));
    if (index >= 0 && index < this.products().length) {
      currentProducts.splice(index, 1);
      this.products.set(currentProducts);
      this.__CommonService.saveToStorage('products', currentProducts);
      return true;
    }
    else return false;
  }

findProductByName(name:string):Product[]{
  const search = name.trim().toLowerCase();
   return  this.usedProducts.filter(product =>
     product.name.toLowerCase().includes(search) || product.nameAr.toLowerCase().includes(search)
  );
  }

findProductByBarcode(barcode:string):Product[]{
    const search = barcode.trim().toLowerCase();
    return this.usedProducts.filter(product =>
      product.barcode.toLowerCase() == search
   );
  }
   getProductEmptyValue():Product{
     return {
        id:-1,
        name: '',
        nameAr: '',
        barcode: '',
        price: 0,
        quantity: '0',
        tax: 0,
        status: 'Inactive',
        variants:[],
        variantsDetails:[]
      };
  }


}
