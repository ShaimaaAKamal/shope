import { Component, EventEmitter, Input, Output, Signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
@Input() route:string='';
@Input() items:any[]=[];
@Input() sortKey:string='';
@Input() header:string='';
@Input() subTitle:string='';
@Input() BtnName:string='';
@Input() columns:any[]=[];
// @Input() del:boolean=false;
@Input() serviceType:string='';

@Output() addNewVar=new EventEmitter<boolean>();
@Output() deleteSelected=new EventEmitter<boolean>();

noItems!:boolean;

ngOnInit(): void {
  this.noItems=this.items.length == 0
}

ngOnChanges(changes: SimpleChanges): void {
 if(changes['items'])   this.noItems=this.items.length == 0
}

handleDispalyedItems(displayedItems:any[]){
  this.items=[...displayedItems];
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
