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
  else if(this.order && this.order.status == 'paid' && (this.__OrderService.calculateTotalProducts(this.order.products) <=0))
  {
    this.__ToastingMessagesService.showToast("There is no products to be returned",'error');
    this.__Router.navigateByUrl('Orders');
  }
  else {
    this.__OrderService.orderProducts.set([...this.order.products.map(p => ({ ...p }))]);
    this.orderProducts = this.order.products.map(p => ({ ...p }));
    this.__OrderService.setInvoiveCustomer(this.order.customer);
  }
}

// returnOrder(){
//   if(this.__OrderService.orderProducts().length === 0)
//   {
//     this.__ToastingMessagesService.showToast("Products count must be > 0",'error');
//     this.__Router.navigateByUrl('Orders/create');
//   }
//   else{
//     const valid=this.validateReturnOrder(this.__OrderService.orderProducts());
//     if(valid){
//        this.order.hasARetrun=true;
//         const result$=this.__OrderService.updateOrder(this.order);
//   result$.subscribe((result) => {
//   if (result.status) {
//     const code = this.__CommonService.generate10CharCode();
//     const returnOrder = this.__OrderService.buildOrder(this.order, code, 0, 'return');

//     this.__OrderService.addNewOrder(returnOrder).subscribe((addResult) => {
//       this.__ToastingMessagesService.showToast(addResult.message, addResult.status ? 'success' : 'error');
//       if (addResult.status) {
//         this.__Router.navigateByUrl('Orders/create');
//       }
//     });
//   } else {
//     this.__ToastingMessagesService.showToast(result.message, 'error');
//   }
// });

//     }
//   }
// }

returnOrder(){

  if(this.__OrderService.orderProducts().length === 0)
  {
    this.__ToastingMessagesService.showToast("Products count must be > 0",'error');
    this.__Router.navigateByUrl('Orders/create');
  }
  else{
    const valid=this.validateReturnOrder(this.__OrderService.orderProducts());
    if(valid){
      if(!this.order.hasARetrun)
               { this.order.remainingQty=this.__OrderService.calculateTotalProducts(this.order.products) - this.__OrderService.getTotalQuantity();
                this.order.hasARetrun=true;
              }
      else
        this.order.remainingQty=(this.order.remainingQty ?? 0) - this.__OrderService.getTotalQuantity();
        this.calculateRemainingProducts();
        const result$=this.__OrderService.updateOrder(this.order);
  result$.subscribe(() => {
    const code = this.__CommonService.generate10CharCode();
    const returnOrder = this.__OrderService.buildOrder(this.order, code, 0, 'return');

    this.__OrderService.addNewOrder(returnOrder).subscribe(() => {
        this.__Router.navigateByUrl('Orders/create');
    });

}); }}
}

validateReturnOrder(newReturnProducts:any): boolean {
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
      // this.__TranslateService.instant('RETURN.MAX_QUANTITY', { quantity:originalProduct.quantity, name:originalProduct.name });
      // this.__ToastingMessagesService.showToast(`You can only return up to ${originalProduct.quantity} of "${originalProduct.name}".`, 'error');
       this.__TranslateService.instant('RETURN.MAX_QUANTITY', { quantity:originalProduct.quantity, name:originalProduct.nameEn });
      this.__ToastingMessagesService.showToast(`You can only return up to ${originalProduct.quantity} of "${originalProduct.nameEn}".`, 'error');
      return false;
    }
  }
  return true;
}

cancalReturn(){
  this.__Router.navigateByUrl('Orders/create');
}
calculateRemainingProducts(){
const updatedProducts:Product[] = [];
const returnedProducts=this.__OrderService.orderProducts();
const returnedItems:Product[] = []

this.order.products.forEach(product => {
  const returned = returnedProducts.find(p => p.id === product.id);

  if (returned) {
    const remainingQty:number = Number(product.quantity) - Number(returned.quantity);

    if (remainingQty > 0) {
      // updatedProducts.push({ ...product, quantity: String(remainingQty) });
            updatedProducts.push({ ...product, quantity: (remainingQty) });

    }

    // returnedItems.push({ ...product, quantity: String(returned.quantity) });
        returnedItems.push({ ...product, quantity: (returned.quantity) });

  } else {
    updatedProducts.push(product);
  }
});

this.order.products = updatedProducts;
}
}
