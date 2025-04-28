import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-checkbox',
  standalone: false,
  templateUrl: './input-checkbox.component.html',
  styleUrl: './input-checkbox.component.scss'
})
export class InputCheckboxComponent {
@Input() value:string='';
@Input() id:string='';
@Input() label:string='';
@Output() checked=new EventEmitter<any>();

onCheckboxChange($event:any){
  this.checked.emit($event.target.checked)
}
}
