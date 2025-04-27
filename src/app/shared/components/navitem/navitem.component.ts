import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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

constructor(private __Router:Router){}
showHeader(){
  this.shopping.nativeElement.classList.remove('d-none');
}
hideHeader(){
  this.shopping.nativeElement.classList.add('d-none');
}

handleSpecialClick(name: string) {
  switch (name) {
    case 'Hold_Orders':
      console.log('Hold Orders clicked!');
      this.__Router.navigateByUrl('Orders/create?popup=hold_orders');
      break;
    case 'Return_Order':
      console.log('Return Order clicked!');
      // your return_order logic here
      break;
    case 'End_Day':
      console.log('End Day clicked!');
      // your end_Day logic here
      break;
    default:
      break;
  }
}
}
