import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { OrderService } from '../../../Services/order/order.service';

@Component({
  selector: 'app-return-order-code-form',
  standalone: false,
  templateUrl: './return-order-code-form.component.html',
  styleUrl: './return-order-code-form.component.scss'
})
export class ReturnOrderCodeFormComponent {
 private __Router=inject(Router);
 private __OrderService=inject(OrderService);

 errorMessage:string='';
 @ViewChild('orderCode') orderCode!:InputComponent;

 done(): void {
  // const code = this.orderCode.value?.trim();
  // const result = this.__OrderService.getOrderByCode(code);
 const id =this.orderCode.value?.trim();
const result = this.__OrderService.getOrderById(Number(id));
  if (!result) {
    this.errorMessage = 'No Order Found with this code';
    return;
  }

  if (result.status === 'hold') {
    this.errorMessage = 'This is a hold order';
    return;
  }

   if (result.status == 'return') {
    this.errorMessage = 'This is a return order';
    return;
  }

  if (result.status == 'paid' && (this.__OrderService.calculateTotalProducts(result.products) <=0)) {
    this.errorMessage = "There is no products to be returned";
    return;
  }
  this.__Router.navigate(['/Orders/Return_Order'], {
    state: { order: result }
  });
}

close(){
      this.__Router.navigateByUrl('Orders/create');
    }

clearErrorMessage(){
        this.errorMessage='';
      }
}
