import { Component, effect, EventEmitter, Input, Output, Signal } from '@angular/core';
import { Order } from '../../../../Interfaces/order';
import { LanguageService } from '../../../../Services/Language/language.service';

 interface OrderInputInterface {
  order: Order;
  additionalInfo: string;
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
  additionalInfo: '',
  flexGrow: false,
};
personImage:string='person.jpg';
isRtl!:Signal<boolean>;
customerName:string='';

constructor(private __LanguageService:LanguageService){
  this.isRtl=this.__LanguageService.rtlClassSignal;
   effect(() => {
      this.getCustomerName();
    });
}
ngOnInit(): void {
   this.personImage=this.ClientInfoData.order.customer.image ?? 'person.jpg';
}
getCustomerName(){
    this.customerName= this.isRtl() ? this.ClientInfoData.order.customer.nameAr : this.ClientInfoData.order.customer.name;
}

}
