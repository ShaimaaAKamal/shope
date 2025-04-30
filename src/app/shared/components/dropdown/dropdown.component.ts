import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
@Input() title:string='';
@Input() dropdownSelection:string='';
@Input() optionsArray:any[]=[];
@Input() key:string='';
@Input() noBorder:boolean=false;
@Output() changeSelect=new EventEmitter<any>();
selectOption(option:any){
  this.dropdownSelection=option[this.key];
  this.changeSelect.emit(option);
}
}
