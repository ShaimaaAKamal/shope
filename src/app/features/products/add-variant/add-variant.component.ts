import { Component, ElementRef, EventEmitter, inject, Input, Output, QueryList, ViewChild, ViewChildren, signal } from '@angular/core';
import { Variant } from '../../../Interfaces/variant';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../Services/Product/product.service';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-add-variant',
  standalone: false,
  templateUrl: './add-variant.component.html',
  styleUrl: './add-variant.component.scss'
})
export class AddVariantComponent {
  private __ProductService=inject(ProductService);
  private __LanguageService=inject(LanguageService);

  isRtl=this.__LanguageService.rtlClassSignal;
  preSetVariants=this.__ProductService.variantOptions;
  defaultSelection =  this.preSetVariants().filter((option) => option.name === 'size')[0]
  variantSelection = this.isRtl()? this.defaultSelection.nameAr:this.defaultSelection.name;
  variantValues=  this.defaultSelection.values;
  variantSelectValue=this.defaultSelection.values[0];
  insertVariantNewValue:boolean=false;

  values: any[] =  [];
  showColorPickerContainer: boolean = false;
  // addNewVariant:boolean=false
  ProductVariantOptions= signal<any>([]);
  showColorPicker: boolean[] = [];
  showDeleteIcon: boolean = false;
  type:string='text';

  @Input() saveVariants:boolean=false;
  // @Input() alreadyExist:boolean=false;
  @Output() variantDetails = new EventEmitter<any>();
  @Output() deleteAddVariant = new EventEmitter<boolean>();

  @ViewChildren('variantValue') variantValuesRefs!: QueryList<InputComponent>;
  @ViewChild('optionName') optionName!:InputComponent;
  @ViewChildren('colorPick') colorPickInputs!: QueryList<ElementRef>;

  constructor() {
  }

  ngOnInit(): void {
  this.showColorPicker = this.values.map(() => false);
}

//  ngOnChanges(changes: SimpleChanges) {
//     if (changes['alreadyExist']) {
//        if(changes['alreadyExist'].currentValue)
//         this.nameErrorMessage='Name already exist'
//       else  this.nameErrorMessage='';
//     }
//   }

  chooseVariantName(event: any){
    this.variantValues=event.values;
    this.variantSelectValue=event.values[0];
    this.variantSelection=event.name;
    this.showColorPickerContainer = event.name === 'color' || event.name === 'اللون';
  }
 chooseOption(event: any) {
    const name=event.name || event;
    this.variantSelectValue=name;
    // this.type=name;
  }

toggleColorPicker(index: number): void {
  this.showColorPicker[index] = true;
}

hideColorPicker(index: number): void {
  this.showColorPicker[index] = false;
}

onColorChange(color:string,index:number){
  this.values[index]['color']=color;
  this.hideColorPicker(index);
}
showNewValueInput(){
    this.values.push({id: crypto.randomUUID(),value:'',color:'#000',type:this.type});
    this.insertVariantNewValue=true;
}
addNewValue() {
    let variantNewValue: any = (this.variantSelection !== 'color')
  ? this.variantValuesRefs.first?.value?.trim()
  : this.values[0]?.color;

    this.preSetVariants.update(options =>
    options.map(option => {
      if (option.name === this.variantSelection) {
        return {
          ...option,
          values: [...option.values,variantNewValue],
        };
      }
      return option;
    })
  );
  this.insertVariantNewValue=false;
  this.values.pop();
  this.variantValues=[...this.variantValues,variantNewValue]
  }

removeValue(id: string,type:string=''): void {
  if(!type) this.insertVariantNewValue=false;
  this.values = this.values.filter(v => v.id !== id);

}

addVariant() {
  const productVariant={
    name:this.variantSelection,
    values:[this.variantSelectValue]
  }
      this.variantDetails.emit(productVariant);

//    if(this.showColorPickerContainer)
//      this.values[0]['type']='color';
//   const variantValues = [
//   ...new Set(
//     this.variantValuesRefs.map((inputComponent, index) => {
//       const value = this.values[index];
//       return value.type === 'color' ? value.color : inputComponent.value?.trim();
//     }).filter(Boolean)
//   )
// ];

//   const variantName = this.optionName.value?.trim();

//   if (variantName) {
//     this.nameErrorMessage = '';
//     const variant: Variant = {
//       name: variantName,
//       type:this.type,
//       values: variantValues
//     };
//     this.variantDetails.emit(variant);
//   } else {
//     this.nameErrorMessage = "Name can't be empty";
//   }
}

  deleteVariant() {
    this.deleteAddVariant.emit(true);
  }
}
