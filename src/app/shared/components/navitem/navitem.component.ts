import { Component, ElementRef, Input, ViewChild } from '@angular/core';

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

showHeader(){
  this.shopping.nativeElement.classList.remove('d-none');
}
hideHeader(){
  this.shopping.nativeElement.classList.add('d-none');
}
}
