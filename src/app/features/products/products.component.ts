import { Component, computed, Signal } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { ProductService } from '../../Services/Product/product.service';
import { ToastingMessagesService } from '../../Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  products!: Signal<Product[]>;
  newProduct!:Product;
  type:string='';

  constructor(
  private __ProductsService: ProductService,
  private __ToastingMessagesService:ToastingMessagesService ) {
     this.products = computed(() =>
    this.__ProductsService.products().slice().sort((a, b) => b.id - a.id)
  );
  }

addNew(value:boolean){
 this.type='new';
 this.newProduct=this.__ProductsService.getProductEmptyValue();
 this.newProduct.id=this.products().length + 1;
 this.__ProductsService.addNewProduct(this.newProduct);
}

deleteNewProduct(del:boolean){
  const result=this.__ProductsService.deleteProductByIndex(0);
  if(result) this.type='';
  const message=result?'product has been deleted successfully':'Product can not be deleted';
  const toastType=result?'success':'error'
  this.__ToastingMessagesService.showToast(message,toastType);
}

deleteSelected(del:boolean){
  console.log('deleteSelected');
}
}
