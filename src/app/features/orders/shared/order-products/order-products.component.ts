import { Component, effect, inject, Input, signal, Signal } from '@angular/core';
import { Product } from '../../../../Interfaces/product';
import { OrderService } from '../../../../Services/order/order.service';
import { OrderProduct } from '../../../../Interfaces/order-product';
import { SharedService } from '../../../../Services/Shared/shared.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ProductService } from '../../../../Services/Product/product.service';

 interface orderProductsInterface {
  isRtl: Signal<boolean>;
  displayQtySection: boolean;
}
@Component({
  selector: 'app-order-products',
  standalone: false,
  templateUrl: './order-products.component.html',
  styleUrl: './order-products.component.scss'
})
export class OrderProductsComponent {

  @Input() OrderProductsData: orderProductsInterface = {
  isRtl: signal(false),
  displayQtySection: true,
};
 private __OrderService=inject(OrderService);
 private __ProductService=inject(ProductService);

//  private __SharedService=inject(SharedService);
 currency:string='SAR';
 products= this.__OrderService.orderProducts;
 getTotalQuantity=this.__OrderService.getTotalQuantity;
  productNames = new Map<string, string>();


  constructor(){
    effect(() => {
    const _ = this.OrderProductsData.isRtl();
    this.loadProductNames();
  });
  }

private loadProductNames(): void {
  const requests = this.products().map((orderProduct) =>
    this.__ProductService.getProduct( orderProduct.productId).pipe(
      map((product) => ({
        id: orderProduct.productId,
        name: this.OrderProductsData.isRtl() ? product.data.nameAr : product.data.nameEn
      })),
      catchError((err) => {
        console.error(`Failed to load product ${orderProduct.productId}`, err);
        return of({ id: orderProduct.productId, name: '' });
      })
    )
  );

  forkJoin(requests).subscribe((results) => {
    const updatedMap = new Map<string, string>();
    results.forEach(({ id, name }) => updatedMap.set(String(id), name));
    this.productNames = updatedMap;
  });
}

getOrderName(product: OrderProduct): string {
      return this.productNames.get(String(product.productId)) ?? '';  }


updateQuantity(index:number, newQuantity:number){
      this.products()[index].soldQuantity = newQuantity;
      this.__OrderService.UpdateProducts(this.products());
}
removeProduct(index:number){
        this.products().splice(index, 1);
        this.__OrderService.UpdateProducts(this.products());
}

getProductQuantity(product:OrderProduct){
  return Number(product.soldQuantity);
}
}
