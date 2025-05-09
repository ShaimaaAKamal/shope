import {  Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-variant-value-details',
  standalone: false,
  templateUrl: './variant-value-details.component.html',
  styleUrl: './variant-value-details.component.scss'
})
export class VariantValueDetailsComponent {

@Input() quantity:string='0';
variantDetail:any;
@Input() displayedVariants!:any[];
@Input() index!:number;

@ViewChildren('inputRef') inputComponentRefs!: QueryList<InputComponent>;
@Output() variantProductDetaills=new EventEmitter<any>();


ngOnChanges(changes: SimpleChanges) {
    if (changes['displayedVariants']){
       this.variantDetail=this.displayedVariants[this.index];
       setTimeout(() => {
      this.displayVariantDetails();
    });

    }

}

displayVariantDetails(){
  this.inputComponentRefs.forEach(inputComponent => {
   inputComponent.value=this.variantDetail?.details[inputComponent.id] ?? '';
  });
this.quantity=this.variantDetail?.details['quantity'] ?? '0';
}

updateQuantity(newQuantity:string){
  this.quantity=newQuantity;
  this.variantProductDetaills.emit(newQuantity);
}


getVariantDetails(){
  const variantDetailsValue: Record<string, any> = {};

  this.inputComponentRefs.forEach(inputComponent => {
    const id = inputComponent.id;
    const value = inputComponent.value?.trim?.() ?? null;
    if (id) {
      variantDetailsValue[id] = value;
    }
  });
variantDetailsValue['quantity']=this.quantity;
return variantDetailsValue;
}

}
