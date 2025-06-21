import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderService } from '../../../../Services/order/order.service';
import { CommonService } from '../../../../Services/CommonService/common.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Order } from '../../../../Interfaces/order';
import { Router } from '@angular/router';
import { Customer } from '../../../../Interfaces/customer';
  interface paymentButtonsInterface {
  getPaidAmount: () => number;
  inputMap: { [key: string]: InputComponent };
  order: Order | null;
}
@Component({
  selector: 'app-payment-buttons',
  standalone: false,
  templateUrl: './payment-buttons.component.html',
  styleUrl: './payment-buttons.component.scss'
})
export class PaymentButtonsComponent {
  @Input() PaymentButtonsData!: paymentButtonsInterface;
   @Output() mustBePaid=new EventEmitter<boolean>(false);
  @Output() clearCustomer=new EventEmitter<void>();

  constructor( private __OrderService: OrderService,
   private __Router:Router) {}


  pay_Order() {
    const paidAmount = this.PaymentButtonsData.getPaidAmount();
    const totalAmount = this.__OrderService.getGrossTotal();

    if (paidAmount >= totalAmount && this.__OrderService.orderProducts().length > 0) {
      // this.setOrderDetails('paid');
            this.setOrderDetails(2);

            this.mustBePaid.emit(true);
    } else {
      this.mustBePaid.emit(false);
    }
  }

  hold_Order() {
    // this.setOrderDetails('hold');
    this.setOrderDetails(1);
  }

  cancal_Order() {
    this.clearOrder();
    this.__Router.navigateByUrl('Orders/create');
  }

// setOrderDetails(status: string) {
//   const order = this.buildOrder(status);

//   const action$ = this.PaymentButtonsData.order
//     ? this.__OrderService.updateOrder(order)
//     : this.__OrderService.addNewOrder(order);

//   action$.subscribe((actionSuccess) => {
//     if (actionSuccess.status) {
//       this.__ToastingMessagesService.showToast(actionSuccess.message, 'success');
//       if (!this.PaymentButtonsData.order)
//         this.resetOrder();
//       else
//         this.__Router.navigateByUrl('Orders/create');
//     } else {
//       this.__ToastingMessagesService.showToast(actionSuccess.message, 'error');
//     }
//   });
// }
// setOrderDetails(status: string) {
setOrderDetails(invoiceType: number) {

  // const order = this.buildOrder(status);
  const order = this.buildOrder(invoiceType);
  const action$ = this.PaymentButtonsData.order
    ? this.__OrderService.updateOrder(order)
    : this.__OrderService.addNewOrder(order);

  action$.subscribe(() => {
      if (!this.PaymentButtonsData.order)
        this.resetOrder();
      else
        this.__Router.navigateByUrl('Orders/create');

  });
}
// private buildOrder(status: string): Order {
private buildOrder(invoiceType: number): Order {
  const discount=this.getInputValue('_discountValue');
  const   paymentMethods= {
      cash: this.getInputValue('_Cash'),
      network: this.getInputValue('_Network'),
      masterCard: this.getInputValue('_Master_Card')
    }
//  return this.__OrderService.buildOrder(this.PaymentButtonsData.order,code,discount,status,paymentMethods)
 return this.__OrderService.buildOrder(this.PaymentButtonsData.order,discount,invoiceType,paymentMethods)

}
private getInputValue(key: string): number {
  return parseFloat(this.PaymentButtonsData.inputMap[key]?.value || '0');
}
private resetOrder(): void {
  this.clearOrder();
  // this.code = this.generateOrderCode();
}

private clearOrder(): void {
    this.__OrderService.orderProducts.set([]);
      Object.values(this.PaymentButtonsData.inputMap).forEach((input: InputComponent) => {
      input.value = '';
      input.nativeInput?.dispatchEvent(new Event('input'));
    });
    this.__OrderService.setPaidAmount(0);
    this.__OrderService.discount.set(0);
    this.clearCustomer.emit();
  }



}
