// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { Router } from '@angular/router';

// interface PageControlsInterface {
//   route: string;
//   type: string;
//   items: any[];
//   sortKey: string;
// }
// @Component({
//   selector: 'app-page-controls',
//   standalone: false,
//   templateUrl: './page-controls.component.html',
//   styleUrl: './page-controls.component.scss'
// })
// export class PageControlsComponent {
//   @Input() PageControlsComponentData:PageControlsInterface={
//   route: '',
//   type: '',
//   items: [],
//   sortKey: ''
//   }
//   @Output() displayedItems=new EventEmitter<any[]>()
//   @Output() deleteEvent=new EventEmitter<boolean>()
//   @Output() addNewVar=new EventEmitter<boolean>()

//   constructor(private __Router:Router){}

// AddNew(){
//     switch(this.PageControlsComponentData.type){
//       case 'product': this.addNewVar.emit(true); break;
//       case 'order':   this.__Router.navigateByUrl(this.PageControlsComponentData.route); break;
//       default:break;

//     }
//   }

// sort(){
// this.PageControlsComponentData.items.sort((a, b) => a[this.PageControlsComponentData.sortKey] - b[this.PageControlsComponentData.sortKey]);
// this.displayedItems.emit(this.PageControlsComponentData.items);
// }
// deleteSelected(){
//   this.deleteEvent.emit(true)
// }
// }






import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceInterface } from '../../../Interfaces/service-interface';

interface PageControlsInterface {
  route: string;
  type: string;
  items: any[];
  sortKey: string;
  servicesList:ServiceInterface[]
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
  sortKey: '',
  servicesList:[]
  }
  @Output() displayedItems=new EventEmitter<any[]>()
  @Output() deleteEvent=new EventEmitter<boolean>()
  @Output() addNewVar=new EventEmitter<boolean>()
  @Output() displayDir=new EventEmitter<string>()
  @Input() servicesList: ServiceInterface[] = [];
  @Output() serviceSelected = new EventEmitter<string>();

  dropdownVisible = false;

  constructor(private __Router:Router){}

AddNew(){
    switch(this.PageControlsComponentData.type){
      case 'product': this.addNewVar.emit(true); break;
      case 'order':   this.__Router.navigateByUrl(this.PageControlsComponentData.route); break;
      case 'customer':    this.addNewVar.emit(true); break;
      case 'category':    this.addNewVar.emit(true); break;
      case 'variant':    this.addNewVar.emit(true); break;
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
showFilterOptions(){

}
showServices(){}

setDisplayDir(dir:string){
  this.displayDir.emit(dir);
}


toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible;
}

onServiceClick(action: string) {
  this.serviceSelected.emit(action);
  this.dropdownVisible = false;
}
}

