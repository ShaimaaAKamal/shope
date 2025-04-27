import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-controls',
  standalone: false,
  templateUrl: './page-controls.component.html',
  styleUrl: './page-controls.component.scss'
})
export class PageControlsComponent {
 @Input()  route:string='';
  @Input() type:string='';
  @Input() items:any[]=[];
  @Input()  sortKey:string='';
  @Output() displayedItems=new EventEmitter<any[]>()
  @Output() deleteEvent=new EventEmitter<boolean>()
  @Output() addNewVar=new EventEmitter<boolean>()

  constructor(private __Router:Router){}

AddNew(){
    switch(this.type){
      case 'product': this.addNewVar.emit(true); break;
      case 'order':   this.__Router.navigateByUrl(this.route); break;
      default:break;

    }
    // if(this.type == 'product' )
    // this.addNewVar.emit(true);
    // this.__Router.navigateByUrl(this.route);
  }

sort(){
this.items.sort((a, b) => a[this.sortKey] - b[this.sortKey]);
this.displayedItems.emit(this.items);
}
deleteSelected(){
  this.deleteEvent.emit(true)
}
}
