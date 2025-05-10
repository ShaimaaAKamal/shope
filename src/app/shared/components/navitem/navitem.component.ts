import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-navitem',
  standalone: false,
  templateUrl: './navitem.component.html',
  styleUrl: './navitem.component.scss'
})
export class NavitemComponent {
@Input() isCollapsed:boolean=false;
@Input() navItemName:string='';
@Input() classes:string='';
@ViewChild('shopping') shopping!:ElementRef;

constructor(private __Router:Router, private __LanguageService:LanguageService){}
showHeader(){
  this.shopping.nativeElement.classList.remove('d-none');
}
hideHeader(){
  this.shopping.nativeElement.classList.add('d-none');
}

handleSpecialClick(name: string) {
  switch (name) {
    case 'Hold_Orders':
      this.__Router.navigateByUrl('Orders/create?popup=hold_orders');
      break;
    case 'Return_Order':
      this.__Router.navigateByUrl('Orders/create?popup=return_orders');
      break;
    case 'Add_Variant':
        this.__Router.navigateByUrl('Products?popup=add_variant');
      break;
    case 'End_Day':
      console.log('End Day clicked!');
      break;
    case 'Arabic':
      this.__LanguageService.changeLanguage('ar');
      break;
    case 'اللغة الإنجليزية':
       this.__LanguageService.changeLanguage('en');
       break;
    default:
      break;
  }
}
}
