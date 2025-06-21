import { Component, EventEmitter, Input, Output } from '@angular/core';
interface InputCheckboxInterface{
  value:any,
  id:any,
  label:string
}
@Component({
  selector: 'app-input-checkbox',
  standalone: false,
  templateUrl: './input-checkbox.component.html',
  styleUrl: './input-checkbox.component.scss'
})
export class InputCheckboxComponent {
@Input() InputCheckboxComponentData:InputCheckboxInterface={
  value:'',
  id:'',
  label:''
}
@Output() checked=new EventEmitter<any>();

onCheckboxChange($event:any){
  this.checked.emit($event.target.checked)
}
}
