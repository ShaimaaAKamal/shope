import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../../Interfaces/product';
import { OrderService } from '../../../../Services/order/order.service';

@Component({
  selector: 'app-order-products',
  standalone: false,
  templateUrl: './order-products.component.html',
  styleUrl: './order-products.component.scss'
})
export class OrderProductsComponent {
  private __OrderService=inject(OrderService)
 products= this.__OrderService.orderProducts;
 getTotalQuantity=this.__OrderService.getTotalQuantity;

updateQuantity(index:number, newQuantity:string){
        this.products()[index].quantity = newQuantity;
      this.__OrderService.UpdateProducts(this.products());
}
removeProduct(index:number){
        this.products().splice(index, 1);
        this.__OrderService.UpdateProducts(this.products());
}

getProductQuantity(product:Product){
  return Number(product.quantity);
}
}
