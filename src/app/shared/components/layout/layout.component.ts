import { Component, EventEmitter, Input, Output, Signal, SimpleChanges } from '@angular/core';

interface LayoutInterface {
  route: string;
  items: any[];
  sortKey: string;
  header: string;
  subTitle: string;
  btnName: string;
  columns: any[];
  serviceType: string;
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
};

@Output() addNewVar=new EventEmitter<boolean>();
@Output() deleteSelected=new EventEmitter<boolean>();

noItems!:boolean;
ngOnInit(): void {
  this.noItems=this.LayoutComponentDate.items.length == 0
}

ngOnChanges(changes: SimpleChanges): void {
 if(changes['LayoutComponentDate'])   this.noItems=this.LayoutComponentDate.items.length == 0
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
}
