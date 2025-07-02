import { Component, effect, EventEmitter, Input, Output, Signal } from '@angular/core';
import { Order } from '../../../../Interfaces/order';
import { LanguageService } from '../../../../Services/Language/language.service';
import { Customer } from '../../../../Interfaces/customer';
import { CustomerService } from '../../../../Services/Customer/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
interface OrderInputInterface {
  order: Order;
  additionalInfo: number | undefined;
  flexGrow?: boolean;
}

@Component({
  selector: 'app-client-info',
  standalone: false,
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.scss'
})
export class ClientInfoComponent {

  @Input() ClientInfoData: OrderInputInterface={
  order: {} as Order,
  additionalInfo: 0,
  flexGrow: false,
};
personImage:string='person.jpg';
isRtl!:Signal<boolean>;
customerName:string='';


constructor(
  private __LanguageService: LanguageService,
  private __CustomerService: CustomerService
) {
  this.isRtl = this.__LanguageService.rtlClassSignal;

  effect(() => {
    const isRtl = this.isRtl();
    const customerId = this.ClientInfoData.order.customerId;
    if (!customerId) return;

    this.__CustomerService.getCustomerByID(customerId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.customerName = isRtl ? data.data.firstNameAr : data.data.firstNameEn;
        }
      });
  });
}

ngOnInit(): void {
  //  this.personImage=this.ClientInfoData.order.customer.image ?? 'person.jpg';
     this.personImage='person.jpg';

}

// getCustomerName(){
//     // this.customerName= this.isRtl() ? this.ClientInfoData.order.customer.nameAr : this.ClientInfoData.order.customer.name;
//          const customer=this.__CustomerService.getCustomerByID(this.ClientInfoData.order.customerId)
//         // this.customerName= this.isRtl() ? this.ClientInfoData.order.customer.nameAr : this.ClientInfoData.order.customer.name;
//         this.customerName= this.isRtl() ? customer.firstNameAr : customer.firstNameEn;
// }



}
