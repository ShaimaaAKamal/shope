import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

interface PageControlsInterface {
  route: string;
  type: string;
  items: any[];
  sortKey: string;
}
@Component({
  selector: 'app-page-controls',
  standalone: false,
  templateUrl: './page-controls.component.html',
  styleUrl: './page-controls.component.scss'
})
export class PageControlsComponent {
  @Input() PageControlsComponentData:PageControlsInterface={
  route: '',
  type: '',
  items: [],
  sortKey: ''
  }
  @Output() displayedItems=new EventEmitter<any[]>()
  @Output() deleteEvent=new EventEmitter<boolean>()
  @Output() addNewVar=new EventEmitter<boolean>()

  constructor(private __Router:Router){}

AddNew(){
    switch(this.PageControlsComponentData.type){
      case 'product': this.addNewVar.emit(true); break;
      case 'order':   this.__Router.navigateByUrl(this.PageControlsComponentData.route); break;
      default:break;

    }
  }

sort(){
this.PageControlsComponentData.items.sort((a, b) => a[this.PageControlsComponentData.sortKey] - b[this.PageControlsComponentData.sortKey]);
this.displayedItems.emit(this.PageControlsComponentData.items);
}
deleteSelected(){
  this.deleteEvent.emit(true)
}
}
