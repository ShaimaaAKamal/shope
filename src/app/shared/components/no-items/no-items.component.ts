import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-no-items',
  standalone: false,
  templateUrl: './no-items.component.html',
  styleUrl: './no-items.component.scss'
})
export class NoItemsComponent {
@Input() NoItemsComponentData={
  header:'',
  subTitle:'',
  BtnName:'',
  route:''
}
@Output() addNewVar=new EventEmitter<boolean>()


  AddNew(){
     this.addNewVar.emit(true);
  }
}
