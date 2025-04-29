import { Component, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
@Input() type:string='text';
@Input() id:string="";
@Input() label:string="";
@Input() spanLabel:string='';
@Input() placeholder:string='';
@Input() vertCLass:string='';
@Input() readonly:boolean=false;
@Input() hideLabel:boolean=false;
@Input() inputGroup:boolean=false;
@Input() clickMessage:string='';
@Input() errorMessage:string='';

@ViewChild('inputRef') inputElement!: ElementRef;
@ViewChild('inputRef2') groupInputElement!: ElementRef;

 @Output() focus = new EventEmitter<string>();
 @Output() showVariant = new EventEmitter<boolean>();

hideIconVar:boolean=false;
InputQuantity:number=0;

  onFocus(event:any) {
    this.focus.emit(event.target.id);
  }

get nativeInput(): HTMLInputElement | null {
  if (this.inputGroup && this.groupInputElement) {
    return this.groupInputElement.nativeElement;
  }
  if (this.inputElement) {
    return this.inputElement.nativeElement;
  }
  return null;
}
get value(): string {
    if (this.inputGroup && this.groupInputElement) {
    return this.groupInputElement.nativeElement.value || '';
  }
  return this.inputElement?.nativeElement?.value || '';
}

set value(val: string) {
  if (this.inputGroup && this.groupInputElement) {
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
  if(this.clickMessage === 'Infinity' && tagName === 'i') {
    this.readonly = !this.readonly;
    setTimeout(() => {
      const isCurrentlyUnlimited = (this.groupInputElement.nativeElement.value === 'Unlimited Quantity');
      this.groupInputElement.nativeElement.value = isCurrentlyUnlimited ? this.InputQuantity : 'Unlimited Quantity';
    });

  }
}
}
