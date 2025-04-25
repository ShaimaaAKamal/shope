import { Component, inject } from '@angular/core';
import { CommonService } from '../../../../Services/CommonService/common.service';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../Services/order/order.service';

@Component({
  selector: 'app-home-payment',
  standalone: false,
  templateUrl: './home-payment.component.html',
  styleUrl: './home-payment.component.scss'
})
export class HomePaymentComponent {
private __OrderService=inject(OrderService);
products=this.__OrderService.orderProducts;
calculateDueAmount=this.__OrderService.dueAmount;
calculateReminder=this.__OrderService.reminder;
getGrossTotal=this.__OrderService.getGrossTotal;
discountvalue=this.__OrderService.discount;
paidAmount=this.__OrderService.paidAmount;
mustBePaid:boolean=true;


paymentMethods: {
    label: string;
    name: string;
    id: string;
    focusKey: string;
  }[] = [];

activeInputKey!: string;
activeInputEl!: HTMLInputElement;
inputMap: { [key: string]: HTMLInputElement } = {};
  private code!:string;

  constructor( private __CommonService:CommonService ,private __ActivatedRoute:ActivatedRoute){}

  ngOnInit(): void {
      const id = this.__ActivatedRoute.snapshot.paramMap.get('id');
        this.code=this.generateOrderCode();
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
        label: 'Master Card',
        name: 'Master_Card',
        id: 'Master_Card',
        focusKey: '_Master_Card'
      },
      {
        label: 'Network',
        name: 'Network',
        id: 'Network',
        focusKey: '_Network'
      }
    ];
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

  setActiveInput(key: string, input: HTMLInputElement | null) {
  if (!input) return;
  this.activeInputKey = key;
  this.activeInputEl = input;
  this.inputMap[key] = input;
}

  getPaidAmount(): number {
  let total = 0;

  for (const key of Object.keys(this.inputMap)) {
    if(key != '_discountValue'){
          const input = this.inputMap[key];
    const value = parseFloat(input.value || '0');
    total += isNaN(value) ? 0 : value;
    }
  }
   this.__OrderService.paidAmount.set(total);

  return total;
}


pay_Order(){
if(this.getPaidAmount() >= this.getGrossTotal() && this.products().length >0)
{  this.setoOrderDetails('paid');
  this.mustBePaid=true;
}
else this.mustBePaid=false;
}

hold_Order(){
    this.setoOrderDetails('hold');
}

cancal_Order(){
this.clearOrder();
}

private setoOrderDetails(status:string){
let order={
  code:this.code,
  customer:this.__OrderService.invoiveCustomer,
  // salesPerson:this.__OrderCalculationsService.getSalesPerson(),
  salesPerson:"don't forget",
  products:this.products(),
  grossTotal:this.getGrossTotal(),
  discount:parseFloat(this.inputMap['_discountValue']?.value || '0'),
  paymentMethods:{
    cash: parseFloat(this.inputMap['_Cash']?.value || '0'),
    network: parseFloat(this.inputMap['_Network']?.value || '0'),
    masterCard: parseFloat(this.inputMap['_Master_Card']?.value || '0')
  },
 status:status,
 time:new Date()
 }
 if(this.__OrderService.addNewOrder(order))
 {     this.clearOrder();
       this.code=this.generateOrderCode();
 }
}
private generateOrderCode(){
     return this.__CommonService.generate10CharCode();
   }

private clearOrder(): void {
  this.__OrderService.orderProducts.set([]);


  Object.values(this.inputMap).forEach((input: HTMLInputElement) => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
  });
  this.__OrderService.setPaidAmount(0);
  this.__OrderService.discount.set(0);
  this.inputMap = {};
  this.activeInputEl = null!;
  this.activeInputKey = '';
}

enterKey(key: string) {
  if (!this.activeInputEl) return;

  let currentValue = this.activeInputEl.value || '0';
  let newValue = currentValue;

  if (key === 'C') {
    newValue = '0';
  } else if (key === '.') {
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
