import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../Interfaces/order';
import { LanguageService } from '../../../Services/Language/language.service';
import { OrderService } from '../../../Services/order/order.service';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../Services/CommonService/common.service';
import { OrderProduct } from '../../../Interfaces/order-product';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
private destroyRef = inject(DestroyRef);


getTotalQuantity=this.__OrderService.getTotalQuantity;
getNetTotal=this.__OrderService.getNetTotal;

order!:Order;
orderProducts!:OrderProduct[];
currency:string=this.__OrderService.currency;
constructor(private __Router: Router,
private __ToastingMessagesService: ToastingMessagesService,
private __TranslateService: TranslateService,
private __CustomerService:CustomerService) {
  // const nav = this.__Router.getCurrentNavigation();
  // const data = nav?.extras?.state;
  // this.order = {...data?.['order']};

  // // if(this.order && this.order.status == 'hold')
  //   if(this.order && this.order.invoiceType == 1)
  // {
  //   this.__ToastingMessagesService.showToast("This is a hold order",'error');
  //   this.__Router.navigateByUrl('Orders');
  // }
  // //  else if(this.order && this.order.status == 'return')
  //     if(this.order && this.order.invoiceType == 3)

  // {
  //   this.__ToastingMessagesService.showToast("This is a return order",'error');
  //   this.__Router.navigateByUrl('Orders');
  // }
  // // else if(this.order && this.order.status == 'paid' && (this.__OrderService.calculateTotalProducts(this.order.products) <=0))
  //   else if(this.order && this.order.invoiceType == 2 && (this.__OrderService.calculateTotalProducts(this.order.details) <=0))

  // {
  //   this.__ToastingMessagesService.showToast("There is no products to be returned",'error');
  //   this.__Router.navigateByUrl('Orders');
  // }
  // else {
  //   // this.__OrderService.orderProducts.set([...this.order.products.map(p => ({ ...p }))]);
  //    this.__OrderService.orderProducts.set([...this.order.details.map(p => ({ ...p }))]);
  //   // this.orderProducts = this.order.products.map(p => ({ ...p }));
  //    this.orderProducts = this.order.details.map(p => ({ ...p }));
  //   // this.__OrderService.setInvoiveCustomer(this.order.customer);
  //       // this.__OrderService.setInvoiveCustomer(this.__CustomerService.getCustomerByID(this.order.customerId));
  //       this.__CustomerService.getCustomerByID(this.order.customerId).subscribe({
  //         next:(data)=> this.__OrderService.setInvoiveCustomer(data.data)
  //       })
  // }
}

ngOnInit(): void {
  const nav = this.__Router.getCurrentNavigation();
  const data = nav?.extras?.state;
  this.order = { ...data?.['order'] };

  if (!this.order) return;

  if (this.order.invoiceType == 1) {
    this.__ToastingMessagesService.showToast("This is a hold order", 'error');
    this.__Router.navigateByUrl('Orders');
    return;
  }

  if (this.order.invoiceType == 3) {
    this.__ToastingMessagesService.showToast("This is a return order", 'error');
    this.__Router.navigateByUrl('Orders');
    return;
  }

  if (this.order.invoiceType == 2 && this.__OrderService.calculateTotalProducts(this.order.details) <= 0) {
    this.__ToastingMessagesService.showToast("There is no products to be returned", 'error');
    this.__Router.navigateByUrl('Orders');
    return;
  }

  this.__OrderService.orderProducts.set([...this.order.details.map(p => ({ ...p }))]);
  this.orderProducts = this.order.details.map(p => ({ ...p }));


  this.__CustomerService.getCustomerByID(this.order.customerId)
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe({
    next: (data) => this.__OrderService.setInvoiveCustomer(data.data)
  });
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
      // if(!this.order.hasARetrun)

      //          { this.order.remainingQty=this.__OrderService.calculateTotalProducts(this.order.products) - this.__OrderService.getTotalQuantity();
      //           this.order.hasARetrun=true;
      //         }
      // else
      //   this.order.remainingQty=(this.order.remainingQty ?? 0) - this.__OrderService.getTotalQuantity();
        this.calculateRemainingProducts();
        const result$=this.__OrderService.updateOrder(this.order);
  result$.subscribe(() => {
    // const code = this.__CommonService.generate10CharCode();
    // const returnOrder = this.__OrderService.buildOrder(this.order, code, 0, 'return');
    const returnOrder = this.__OrderService.buildOrder(this.order, 0, 2);

    this.__OrderService.addNewOrder(returnOrder).subscribe(() => {
        this.__Router.navigateByUrl('Orders/create');
    });

}); }}
}

// validateReturnOrder(newReturnProducts:any): boolean {
validateReturnOrder(newReturnProducts:OrderProduct[]): boolean {
  for (const returnItem of newReturnProducts) {
    // const originalProduct = this.orderProducts.find(
    //   p => p.id === returnItem.id
    // );
      const originalProduct = this.orderProducts.find(
      p => p.productId === returnItem.productId
    );

    // if (!originalProduct) {
    //   this.__TranslateService.instant('RETURN.INVALID_PRODUCT', { id: returnItem.id });
    //   this.__ToastingMessagesService.showToast(`Product ID ${returnItem.id} was not part of the original order.`, 'error');
    //   return false;
    // }

     if (!originalProduct) {
      this.__TranslateService.instant('RETURN.INVALID_PRODUCT', { id: returnItem.productId });
      this.__ToastingMessagesService.showToast(`Product ID ${returnItem.productId} was not part of the original order.`, 'error');
      return false;
    }

    // if (returnItem.quantity > originalProduct.quantity) {
    //    this.__TranslateService.instant('RETURN.MAX_QUANTITY', { quantity:originalProduct.quantity, name:originalProduct.nameEn });
    //   this.__ToastingMessagesService.showToast(`You can only return up to ${originalProduct.quantity} of "${originalProduct.nameEn}".`, 'error');
    //   return false;
    // }
      if (returnItem.soldQuantity > originalProduct.soldQuantity) {
       this.__TranslateService.instant('RETURN.MAX_QUANTITY', { quantity:originalProduct.soldQuantity, name:originalProduct.productId });
      this.__ToastingMessagesService.showToast(`You can only return up to ${originalProduct.soldQuantity} of "${originalProduct.productId}".`, 'error');
      return false;
    }
  }
  return true;
}

cancalReturn(){
  this.__Router.navigateByUrl('Orders/create');
}

calculateRemainingProducts(){
const updatedProducts:OrderProduct[] = [];
const returnedProducts=this.__OrderService.orderProducts();
const returnedItems:OrderProduct[] = []

this.order.details.forEach(product => {
  const returned = returnedProducts.find(p => p.productId === product.productId);

  if (returned) {
    const remainingQty:number = Number(product.soldQuantity) - Number(returned.soldQuantity);

    if (remainingQty > 0) {
      // updatedProducts.push({ ...product, quantity: String(remainingQty) });
            updatedProducts.push({ ...product, soldQuantity: (remainingQty) });

    }

    // returnedItems.push({ ...product, quantity: String(returned.quantity) });
        returnedItems.push({ ...product, soldQuantity: (returned.soldQuantity) });

  } else {
    updatedProducts.push(product);
  }
});

// this.order.products = updatedProducts;
this.order.details = updatedProducts;

}

// calculateRemainingProducts(){
// const updatedProducts:Product[] = [];
// const returnedProducts=this.__OrderService.orderProducts();
// const returnedItems:Product[] = []

// this.order.products.forEach(product => {
//   const returned = returnedProducts.find(p => p.id === product.id);

//   if (returned) {
//     const remainingQty:number = Number(product.quantity) - Number(returned.quantity);

//     if (remainingQty > 0) {
//       // updatedProducts.push({ ...product, quantity: String(remainingQty) });
//             updatedProducts.push({ ...product, quantity: (remainingQty) });

//     }

//     // returnedItems.push({ ...product, quantity: String(returned.quantity) });
//         returnedItems.push({ ...product, quantity: (returned.quantity) });

//   } else {
//     updatedProducts.push(product);
//   }
// });

// this.order.products = updatedProducts;
// }
}
