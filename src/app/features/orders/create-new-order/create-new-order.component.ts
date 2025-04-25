import { Component, ViewChild } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Customer } from '../../../Interfaces/customer';
import { Product } from '../../../Interfaces/product';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { ProductService } from '../../../Services/Product/product.service';
import { OrderService } from '../../../Services/order/order.service';
import { Order } from '../../../Interfaces/order';

@Component({
  selector: 'app-create-new-order',
  standalone: false,
  templateUrl: './create-new-order.component.html',
  styleUrl: './create-new-order.component.scss'
})
export class CreateNewOrderComponent {
  
constructor(private __OrderService:OrderService){}
ngOnInit(): void {
  this.__OrderService.orderProducts.set([]);
  this.__OrderService.discount.set(0);
  this.__OrderService.setPaidAmount(0);

}
}
