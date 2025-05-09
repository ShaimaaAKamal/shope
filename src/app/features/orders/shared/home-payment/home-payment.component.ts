import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { OrderService } from '../../../../Services/order/order.service';
import { Order } from '../../../../Interfaces/order';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-home-payment',
  standalone: false,
  templateUrl: './home-payment.component.html',
  styleUrl: './home-payment.component.scss'
})
export class HomePaymentComponent {
@Input() order!:Order|null;
@Output() clearCustomer=new EventEmitter<void>();

private __OrderService=inject(OrderService);
products=this.__OrderService.orderProducts;
calculateDueAmount=this.__OrderService.dueAmount;
calculateReminder=this.__OrderService.reminder;
getGrossTotal=this.__OrderService.getGrossTotal;
discountvalue=this.__OrderService.discount;
paidAmount=this.__OrderService.paidAmount;
mustBePaid:boolean=true;
currency:string='SAR';

paymentMethods: {
    label: string;
    name: string;
    id: string;
    focusKey: string;
  }[] = [];

activeInputKey!: string;
activeInputEl!: InputComponent;

inputMap: { [key: string]: InputComponent } = {};
@ViewChildren(InputComponent) inputComponents!: QueryList<InputComponent>;

  ngOnInit(): void {
         this.paymentMethods = [
      {
        label: 'Discount',
        name: 'discount',
        id: 'discount',
        focusKey: '_discountValue'
      },
      {
        label: 'Cash',
        name: 'Cash',
        id: 'Cash',
        focusKey: '_Cash'
      },
       {
        label: 'Network',
        name: 'Network',
        id: 'Network',
        focusKey: '_Network'
      },
      {
        label: 'Master Card',
        name: 'Master_Card',
        id: 'Master_Card',
        focusKey: '_Master_Card'
      },

    ];
  }

 ngAfterViewInit(): void {
  if (this.order) {
    setTimeout(() => {
      this.populateInputMap();
      this.fillInputValuesFromService();
    });
  }
}

private populateInputMap() {
  this.inputComponents.forEach(comp => {
    if (comp.id) {
      this.inputMap[comp.id] = comp;
    }
  });
}

private fillInputValuesFromService() {
  const paymentValues = {
    _discountValue: this.__OrderService.discount(),
    _Cash: this.order?.paymentMethods['cash'] ?? '0',
    _Network: this.order?.paymentMethods['network']  ?? '0',
    _Master_Card: this.order?.paymentMethods['masterCard']  ?? '0'
  };
  Object.entries(paymentValues).forEach(([key, value]) => {
    const input = this.inputMap[key];
    if (input) {
      input.value = value?.toString() || '0';
      input.nativeInput?.dispatchEvent(new Event('input'));
    }
  });

  this.getPaidAmount();
}

setValueFromInputEvent(focusKey: string, event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.setModelValue(focusKey, value);
}

setModelValue(focusKey: string, value: string) {
    const numericValue=Number(value);
    (this as any)[focusKey] = numericValue;

    if (focusKey === '_discountValue') {
      this.calculateDueAmount();
      this.__OrderService.discount.set(numericValue);
    }
  }

  setActiveInput(key: string, input: InputComponent | null) {
  if (!input) return;
  this.activeInputKey = key;
  this.activeInputEl = input;
  this.inputMap[key] = input;
}

  getPaidAmount(): number {
  let total = 0;

  for (const key of Object.keys(this.inputMap)) {
    if(key != '_discountValue' ){
    const input = this.inputMap[key];
    const value = parseFloat(input.value || '0');
    total += isNaN(value) ? 0 : value;
    }
  }
   this.__OrderService.paidAmount.set(total);

  return total;
}

clearCustomerFn(){
  this.clearCustomer.emit()
}
setMustbePaid(value:any){
  this.mustBePaid=value;
}

enterKey(key: string) {
  if (!this.activeInputEl) return;

  let currentValue = this.activeInputEl.value || '0';
  let newValue = currentValue;

  if (key === 'C') {
    newValue = '0';
  }
   else if (key === '.') {
    if (!currentValue.includes('.')) {
      newValue += '.';
    }
  } else {
    newValue = currentValue === '0' ? key : currentValue + key;
    newValue = newValue.replace(/^0+(?!\.)/, '');
  }

  this.activeInputEl.value = newValue;

  if (this.activeInputKey === '_discountValue') {
    this.__OrderService.discount.set(Number(newValue));
  }
this.getPaidAmount();
}

}
