import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

interface DropdownInterface{
 title:string,
 dropdownSelection:string,
 optionsArray:any[],
 key:string,
 noBorder:boolean,
 type?:string
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
  type:''
};
colorField:boolean=false;
@Output() changeSelect=new EventEmitter<any>();

ngAfterViewInit(): void {
  if(this.DropdownComponentData.type == 'color') this.colorField=true;
      else {this.colorField=false;}
}

ngOnChanges(changes: SimpleChanges): void {
 if (changes['DropdownComponentData']) {
        if(this.DropdownComponentData.type == 'color') this.colorField=true;
      else {this.colorField=false;}
      console.log(this.DropdownComponentData.key);
    }
}

selectOption(option:any){
  this.DropdownComponentData.dropdownSelection=option[this.DropdownComponentData.key] || option;
  this.changeSelect.emit(option);
}

getOption(option:any) {
  const key = this.DropdownComponentData.key;
  if (key)
      return option[key]
    else
      return option;}

}
