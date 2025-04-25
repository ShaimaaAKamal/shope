import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-keypad',
  standalone: false,
  templateUrl: './keypad.component.html',
  styleUrl: './keypad.component.scss'
})

export class KeypadComponent {
@Output() key=new EventEmitter<string>();
keypad: string[][] = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', 'C']
];

enterKey(key:string){
 this.key.emit(key);
}
}
