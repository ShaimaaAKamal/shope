import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderService } from '../../../../Services/order/order.service';
import { CommonService } from '../../../../Services/CommonService/common.service';

@Component({
  selector: 'app-payment-buttons',
  standalone: false,
  templateUrl: './payment-buttons.component.html',
  styleUrl: './payment-buttons.component.scss'
})
export class PaymentButtonsComponent {
    code: string = '';

   @Input() getPaidAmount!: () => number;
   @Input() inputMap!: { [key: string]: HTMLInputElement };
   @Output() mustBePaid=new EventEmitter<boolean>(false);
  constructor( private __OrderService: OrderService,private __CommonService: CommonService ) {}

  ngOnInit() {
    this.code = this.generateOrderCode();
  }

  pay_Order() {
    const paidAmount = this.getPaidAmount();
    const totalAmount = this.__OrderService.getGrossTotal();

    if (paidAmount >= totalAmount && this.__OrderService.orderProducts().length > 0) {
      this.setoOrderDetails('paid');
            this.mustBePaid.emit(true);
    } else {
      this.mustBePaid.emit(false);
    }
  }

  hold_Order() {
    this.setoOrderDetails('hold');
  }

  cancal_Order() {
    this.clearOrder();
  }

  setoOrderDetails(status: string) {
    const order = {
      code: this.code,
      customer: this.__OrderService.invoiveCustomer,
      salesPerson: "don't forget",
      products: this.__OrderService.orderProducts(),
      grossTotal: this.__OrderService.getGrossTotal(),
      discount: parseFloat(this.inputMap['_discountValue']?.value || '0'),
      paymentMethods: {
        cash: parseFloat(this.inputMap['_Cash']?.value || '0'),
        network: parseFloat(this.inputMap['_Network']?.value || '0'),
        masterCard: parseFloat(this.inputMap['_Master_Card']?.value || '0')
      },
      status: status,
      time: new Date()
    };

    if (this.__OrderService.addNewOrder(order)) {
      this.clearOrder();
      this.code = this.generateOrderCode();
    }
  }

  private clearOrder(): void {
    this.__OrderService.orderProducts.set([]);

    Object.values(this.inputMap).forEach((input: HTMLInputElement) => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });

    this.__OrderService.setPaidAmount(0);
    this.__OrderService.discount.set(0);
  }

  private generateOrderCode(): string {
    return this.__CommonService.generate10CharCode();
  }

}
