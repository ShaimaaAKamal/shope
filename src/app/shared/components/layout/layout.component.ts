import { Component, EventEmitter, input, Input, Output, Signal, SimpleChanges } from '@angular/core';
import { ServiceInterface } from '../../../Interfaces/service-interface';

interface LayoutInterface {
  route: string;
  items: any[];
  sortKey: string;
  header: string;
  subTitle: string;
  btnName: string;
  columns: any[];
  serviceType: string;
  servicesList:ServiceInterface[];
  page:string
}
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
@Input() LayoutComponentDate:LayoutInterface={
  route: '',
  items: [],
  sortKey: '',
  header: '',
  subTitle: '',
  btnName: '',
  columns: [],
  serviceType: '',
  servicesList:[],
  page:'Products'
};
@Input() close:boolean=false;
@Output() addNewVar=new EventEmitter<boolean>();
@Output() deleteSelected=new EventEmitter<boolean>();
@Output() serviceSelected = new EventEmitter<string>();
@Output() displayDir=new EventEmitter<string>();
@Output() resetFilter=new EventEmitter<void>()
isFilterVisible = false;

noItems!:boolean;
ngOnInit(): void {
  this.noItems=this.LayoutComponentDate.items.length == 0
}

ngOnChanges(changes: SimpleChanges): void {
 if(changes['LayoutComponentDate'])   this.noItems=this.LayoutComponentDate.items.length == 0;
 if(changes['close'] && this.close)   {this.hideFilterOptions(); this.resetFilter.emit()}

}

handleDispalyedItems(displayedItems:any[]){
  this.LayoutComponentDate.items=[...displayedItems];
}
handleDelete(del:boolean){
  this.deleteSelected.emit(del);
}

addNew(value:boolean){
  if(value)
  {
    this.noItems=false;
   this.addNewVar.emit(value);
  }
}
handleServiceAction(action:any){
 this.serviceSelected.emit(action);
}
handleDisplayDir(event:string){
this.displayDir.emit(event);
}

showFilterOptions() {
  this.isFilterVisible = true;
}

hideFilterOptions() {
  this.isFilterVisible = false;
}

}
