import { Component, EventEmitter, Input, Output } from '@angular/core';

interface DropdownInterface{
 title:string,
 dropdownSelection:string,
 optionsArray:any[],
 key:string,
 noBorder:boolean,
  [key: string]: any;

}
@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
@Input() DropdownComponentData:DropdownInterface={
  title:'',
  dropdownSelection:'',
  optionsArray:[],
  key:'',
  noBorder:false,
};
@Output() changeSelect=new EventEmitter<any>();
selectOption(option:any){
  this.DropdownComponentData.dropdownSelection=option[this.DropdownComponentData.key] || option;
  this.changeSelect.emit(option);
}

getOption(option:any) {
  const key = this.DropdownComponentData.key;
  if (key)
    return option[key]
  else return option;

  }

}
