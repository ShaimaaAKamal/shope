import { Component, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
interface InputInterface {
  type: string;
  id: string;
  label: string;
  spanLabel: string;
  placeholder: string;
  vertCLass: string;
  readonly: boolean;
  hideLabel: boolean;
  inputGroup: boolean;
  clickMessage: string;
  errorMessage: string;
  enableFocusBlurTracking: boolean;
}
@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

@Input() InputComponentData={
  type: 'text',
  id: '',
  label: '',
  spanLabel: '',
  placeholder: '',
  vertCLass: '',
  readonly: false,
  hideLabel: false,
  inputGroup: false,
  clickMessage: '',
  errorMessage: '',
  enableFocusBlurTracking: false,
}
@ViewChild('inputRef') inputElement!: ElementRef;
@ViewChild('inputRef2') groupInputElement!: ElementRef;

 @Output() focus = new EventEmitter<string>();
 @Output() blur = new EventEmitter<string>();
 @Output() showVariant = new EventEmitter<boolean>();

hideIconVar:boolean=false;
InputQuantity:number=0;

onFocus(event:any) {
    this.focus.emit(event.target.id);
  }

onBlur(event:any){
    this.blur.emit(event.target.id);
  }
   get nativeInput(): HTMLInputElement | null {
  if (this.InputComponentData.inputGroup && this.groupInputElement) {
    return this.groupInputElement.nativeElement;
  }
  if (this.inputElement) {
    return this.inputElement.nativeElement;
  }
  return null;
}

get value(): string {
    if (this.InputComponentData.inputGroup && this.groupInputElement) {
    return this.groupInputElement.nativeElement.value || '';
  }
  return this.inputElement?.nativeElement?.value || '';
}

set value(val: string) {
  if (this.InputComponentData.inputGroup && this.groupInputElement) {
    this.groupInputElement.nativeElement.value = val;
  } else if (this.inputElement) {
    this.inputElement.nativeElement.value = val;
  }
}
handleClick(event:any) {
  const tagName=event.target.tagName.toLowerCase()
  if( tagName=== 'span'){
    this.showVariant.emit(true);
  }
  if(this.InputComponentData.clickMessage === 'Infinity' && tagName === 'i') {
    this.InputComponentData.readonly = !this.InputComponentData.readonly;
    setTimeout(() => {
      const isCurrentlyUnlimited = (this.groupInputElement.nativeElement.value === 'Unlimited Quantity');
      this.groupInputElement.nativeElement.value = isCurrentlyUnlimited ? this.InputQuantity : 'Unlimited Quantity';
    });

  }
}
}
