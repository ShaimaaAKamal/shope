import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
@Input() DropdownComponentData:{
   title:string,dropdownSelection:string,optionsArray:any[],key:string,noBorder:boolean}={
  title:'',
  dropdownSelection:'',
  optionsArray:[],
  key:'',
  noBorder:false
};
@Output() changeSelect=new EventEmitter<any>();
selectOption(option:any){
  this.DropdownComponentData.dropdownSelection=option[this.DropdownComponentData.key] || option;
  this.changeSelect.emit(option);
}
}

