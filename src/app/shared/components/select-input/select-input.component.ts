import { Component, EventEmitter, Input, Output } from '@angular/core';
interface selectInterface<T extends Record<string, any>>{
  selected: T | null;
  label: string,
  id: string ,
  options: T[],
  prop: string,
  value: string,
  vertCLass:string,
  noOption:string,
}
@Component({
  selector: 'app-select-input',
  standalone: false,
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent<T extends Record<string, any>>{
  @Input() SelectInputComponentData:selectInterface<T>={
  selected:null,
   label: '',
   id:'',
   options: [],
   prop:  '',
   value: '',
   vertCLass:'',
  noOption:''
  }
  @Output() selectedOption: EventEmitter<T> = new EventEmitter<T>();

  onSelectionChange(event: any): void {
   this.selectedOption.emit(event);
  }
}
