import { Injectable, signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

products=signal<Product[]>([
  {id: 1, name: "samsung a35",nameAr: "سامسونج ٣٥", barcode: "", price: 3000, quantity: "", tax: 0, status: "Inactive"},
    {id: 2, name: "samsung e3", nameAr: "سامسونج اي ٣", barcode: "", price: 3000, quantity: "", tax: 0, status: "Inactive"}
]);
 usedProducts:Product[]=this.products();

  constructor(private __CommonService:CommonService) {
  this.products.set(this.__CommonService.getItemsFromStorage('products'));
}

addNewProduct(newProduct : Product){
const exists = this.usedProducts.some((product:Product) => product.name === newProduct.name  );
if (!exists) {
  this.usedProducts.push(newProduct);
  this.products.set(this.usedProducts);
  this.__CommonService.saveToStorage('products',this.usedProducts);
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
  this.products.set(products);
  this.__CommonService.saveToStorage('products',this.usedProducts);
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

  deleteProductByIndex(index:number):boolean{
    if (index >= 0 && index < this.products().length) {
      this.products().splice(index, 1);
      this.products.set(this.products());
      this.__CommonService.saveToStorage('products', this.usedProducts);
      return true;
    }
    else return false;
  }
}
