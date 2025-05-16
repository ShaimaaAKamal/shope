import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../Interfaces/order';
import { LanguageService } from '../../../Services/Language/language.service';
import { OrderService } from '../../../Services/order/order.service';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';
import { Product } from '../../../Interfaces/product';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../Services/CommonService/common.service';

@Component({
  selector: 'app-return-order',
  standalone: false,
  templateUrl: './return-order.component.html',
  styleUrl: './return-order.component.scss'
})
export class ReturnOrderComponent {

private __LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;

private __OrderService=inject(OrderService);
getTotalQuantity=this.__OrderService.getTotalQuantity;
getNetTotal=this.__OrderService.getNetTotal;

order!:Order;
orderProducts!:Product[];
currency:string='SAR';

constructor(private __Router: Router,
private __ToastingMessagesService: ToastingMessagesService,
private __TranslateService: TranslateService,
private __CommonService:CommonService) {
  const nav = this.__Router.getCurrentNavigation();
  const data = nav?.extras?.state;
  this.order = {...data?.['order']};

  if(this.order && this.order.status == 'hold')
  {
    this.__ToastingMessagesService.showToast("This is a hold order",'error');
    this.__Router.navigateByUrl('Orders');
  }
   else if(this.order && this.order.status == 'return')
  {
    this.__ToastingMessagesService.showToast("This is a return order",'error');
    this.__Router.navigateByUrl('Orders');
  }
  else  if(this.order && this.order.hasARetrun )
  {  console.log('in side if', this.order);
    this.__ToastingMessagesService.showToast("This order has already been rerurned before",'error');
    this.__Router.navigateByUrl('Orders');
  }
  else {
    this.__OrderService.orderProducts.set([...this.order.products.map(p => ({ ...p }))]);
    this.orderProducts = this.order.products.map(p => ({ ...p }));
    this.__OrderService.setInvoiveCustomer(this.order.customer);
  }
}


returnOrder(){
  if(this.__OrderService.orderProducts().length === 0)
  {
    this.__ToastingMessagesService.showToast("Products count must be > 0",'error');
    this.__Router.navigateByUrl('Orders/create');
  }
  else{
    const valid=this.validateReturnOrder(this.__OrderService.orderProducts());
    console.log('valid',valid);
    if(valid){
      console.log('in valid');
       this.order.hasARetrun=true;
      //  const result=this.__OrderService.updateOrderHasReturn(this.order);
        const result$=this.__OrderService.updateOrder(this.order);
  result$.subscribe((result) => {
    console.log('i result');
  if (result.status) {
    const code = this.__CommonService.generate10CharCode();
    const returnOrder = this.__OrderService.buildOrder(this.order, code, 0, 'return');

    this.__OrderService.addNewOrder(returnOrder).subscribe((addResult) => {
      console.log('addResult',addResult);
      this.__ToastingMessagesService.showToast(addResult.message, addResult.status ? 'success' : 'error');
      if (addResult.status) {
        this.__Router.navigateByUrl('Orders/create');
      }
    });
  } else {
    this.__ToastingMessagesService.showToast(result.message, 'error');
  }
});

//        if(result.status)
//       {
//         const code=this.__CommonService.generate10CharCode();
//         const returnOrder=this.__OrderService.buildOrder(this.order,code,0,'return');
//         // const result=this.__OrderService.addNewOrder(returnOrder);
//         // this.__ToastingMessagesService.showToast(result.message, result.status ? 'success' : 'error');
//         this.__OrderService.addNewOrder(returnOrder).subscribe((result) => {
//            this.__ToastingMessagesService.showToast(result.message, result.status ? 'success' : 'error');
// });
//         this.__Router.navigateByUrl('Orders/create');
//       }
    }
  }
}

validateReturnOrder(newReturnProducts:any): boolean {
  console.log(this.order);
  if (this.order.hasARetrun) {
      this.__ToastingMessagesService.showToast(
      `A return order already exists for Order #${this.order.code}.`,
      'error'
     );
    return false;
  }

  for (const returnItem of newReturnProducts) {
    const originalProduct = this.orderProducts.find(
      p => p.id === returnItem.id
    );

    if (!originalProduct) {
      this.__TranslateService.instant('RETURN.INVALID_PRODUCT', { id: returnItem.id });
      this.__ToastingMessagesService.showToast(`Product ID ${returnItem.id} was not part of the original order.`, 'error');
      return false;
    }

    if (returnItem.quantity > originalProduct.quantity) {
      this.__TranslateService.instant('RETURN.MAX_QUANTITY', { quantity:originalProduct.quantity, name:originalProduct.name });
      this.__ToastingMessagesService.showToast(`You can only return up to ${originalProduct.quantity} of "${originalProduct.name}".`, 'error');
      return false;
    }
  }
  return true;
}

cancalReturn(){
  this.__Router.navigateByUrl('Orders/create');
}
}
