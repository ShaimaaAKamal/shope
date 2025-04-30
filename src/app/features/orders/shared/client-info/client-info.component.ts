import { Component, effect, EventEmitter, Input, Output, Signal } from '@angular/core';
import { Order } from '../../../../Interfaces/order';
import { LanguageService } from '../../../../Services/Language/language.service';

@Component({
  selector: 'app-client-info',
  standalone: false,
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.scss'
})
export class ClientInfoComponent {
@Input() order!:Order;
@Input() additionalInfo!:string;
@Input() flexGrow:boolean=false;
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
   this.personImage=this.order.customer.image ?? 'person.jpg';
}
getCustomerName(){
    this.customerName= this.isRtl() ? this.order.customer.nameAr : this.order.customer.name;
}

}
