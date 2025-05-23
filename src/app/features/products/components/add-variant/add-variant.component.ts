// import { Component, ElementRef, EventEmitter, inject, Output, QueryList, ViewChildren, signal, Input } from '@angular/core';
// import { InputComponent } from '../../../../shared/components/input/input.component';
// import { ProductService } from '../../../../Services/Product/product.service';
// import { LanguageService } from '../../../../Services/Language/language.service';
// import { CommonService } from '../../../../Services/CommonService/common.service';
// import { VariantOption } from '../../../../Interfaces/variant-option';

// @Component({
//   selector: 'app-add-variant',
//   standalone: false,
//   templateUrl: './add-variant.component.html',
//   styleUrl: './add-variant.component.scss'
// })
// export class AddVariantComponent {
//   private __ProductService=inject(ProductService);
//   private __LanguageService=inject(LanguageService);
//   private __CommonService=inject(CommonService);
//   isRtl=this.__LanguageService.rtlClassSignal;
//   preSetVariants=this.__ProductService.variantOptions;
//   defaultSelection =  this.preSetVariants().filter((option) => option.name === 'size')[0];
//   variantSelection = this.isRtl()? this.defaultSelection.nameAr:this.defaultSelection.name;
//   variantValues=  this.defaultSelection.values;
//   variantSelectValue=this.defaultSelection.values[0];
//   insertVariantNewValue:boolean=false;

//   values: any[] =  [];

//   showColorPickerContainer: boolean = false;
//     showColorPicker: boolean[] = [];
//   ProductVariantOptions= signal<any>(this.__ProductService.currentProduct().variants);
//   exitstErrorMessage:string=''
//   successMessage:boolean=false;
//   // type:string='text';
//   @Output() variants = new EventEmitter<any>();

//   @ViewChildren('variantValue') variantValuesRefs!: QueryList<InputComponent>;
//   @ViewChildren('colorPick') colorPickInputs!: QueryList<ElementRef>;

//   ngOnInit(): void {
//   this.showColorPicker = this.values.map(() => false);
// }

//  chooseVariantName(event: any){
//     this.variantValues=event.values;
//     this.variantSelectValue=event.values[0];
//     this.variantSelection=event.name;
//     this.showColorPickerContainer = event.name === 'color' || event.name === 'اللون';
//   }
//  chooseOption(event: any) {
//     const name=event.name || event;
//     this.variantSelectValue=name;
//   }

// toggleColorPicker(index: number): void {
//   this.showColorPicker[index] = true;
// }

// hideColorPicker(index: number): void {
//   this.showColorPicker[index] = false;
// }

// onColorChange(color:string,index:number){
//   this.values[index]['color']=color;
//   this.hideColorPicker(index);
// }
// showNewValueInput(){
//     // this.values.push({id: crypto.randomUUID(),value:'',color:'#000',type:this.type});
//         this.values.push({id: crypto.randomUUID(),value:'',color:'#000'});
//     this.insertVariantNewValue=true;
// }

// addNewValue() {
//   let variantNewValue: any = (this.variantSelection !== 'color')
//   ? this.variantValuesRefs.first?.value?.trim()
//   : this.values[0]?.color;

// if (!this.variantValues.includes(variantNewValue)) {
//  this.variantValues.push(variantNewValue);
// const result = this.__CommonService.findItemInArray(this.preSetVariants(),(p) => p.name == this.variantSelection || p.nameAr==this.variantSelection );
// if(result.exists){
// this.__ProductService.updateVariant(result.item)
//   .then(() => {
//     this.exitstErrorMessage='';
//     this.successMessage=true;
//   })
//   .catch(() => {
//     this.exitstErrorMessage='Something went wrong';
//     this.successMessage=false;
//   });
//   this.insertVariantNewValue=false;
//   this.values.pop();
//   this.variantSelectValue=variantNewValue;
//   }
// }
// else    { this.exitstErrorMessage="This Value is already Exist";
//           this.successMessage=false;
//       }
//   }
// removeValue(id: string,type:string=''): void {
//   if(!type) this.insertVariantNewValue=false;
//   this.values = this.values.filter(v => v.id !== id);
// }

// addVariant() {
//   this.hideMessages();
//   if(this.values.length ==1) {this.values.pop(); this.insertVariantNewValue=false}
//   const newValue = this.variantSelectValue;
//   const newVariant = {
//     name: this.variantSelection,
//     values: [newValue]
//   };
//   this.ProductVariantOptions.update(options => {
//     const updatedOptions = [...options];
//     const existingIndex = updatedOptions.findIndex(variant => variant.name === newVariant.name);

//     if (existingIndex !== -1) {
//       const existingValues = Array.isArray(updatedOptions[existingIndex].values)
//         ? updatedOptions[existingIndex].values
//         : [updatedOptions[existingIndex].values];

//       if (!existingValues.includes(newValue)) {
//         updatedOptions[existingIndex].values = [...existingValues, newValue];
//       }
//       return updatedOptions;
//     } else {
//       return [...options, newVariant];
//     }
//   });
//   this.updateProductVariants();
//   this.variants.emit(this.ProductVariantOptions());
// }

// deleteVariant() {
//   this.hideMessages();
//   const valueToRemove = this.variantSelectValue;
//   const variantName = this.variantSelection;

//   this.ProductVariantOptions.update(options => {
//     const updatedOptions = [...options];
//     const existingIndex = updatedOptions.findIndex(variant => variant.name === variantName);

//     if (existingIndex !== -1) {
//       const existingValues = Array.isArray(updatedOptions[existingIndex].values)
//         ? updatedOptions[existingIndex].values
//         : [updatedOptions[existingIndex].values];

//       const filteredValues = existingValues.filter((value:any) => value !== valueToRemove);

//       if (filteredValues.length > 0) {
//         updatedOptions[existingIndex].values = filteredValues;
//       } else {
//         updatedOptions.splice(existingIndex, 1);
//       }
//     }

//     return updatedOptions;
//   });
//     this.updateProductVariants();
//   this.variants.emit(this.ProductVariantOptions());
// }

// updateProductVariants() {
//   this.__ProductService.currentProduct.update(currentValue => {
//   const updatedValue = { ...currentValue, variants: this.ProductVariantOptions() };
//   return updatedValue;
// });
// }

// private hideMessages(){
//   this.successMessage=false;
//   this.exitstErrorMessage='';
// }
// }


import { Component, ElementRef, EventEmitter, inject, Output, QueryList, ViewChildren, signal, Input, effect } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ProductService } from '../../../../Services/Product/product.service';
import { LanguageService } from '../../../../Services/Language/language.service';
import { CommonService } from '../../../../Services/CommonService/common.service';

@Component({
  selector: 'app-add-variant',
  standalone: false,
  templateUrl: './add-variant.component.html',
  styleUrl: './add-variant.component.scss'
})
export class AddVariantComponent {
  private __ProductService=inject(ProductService);
  private __LanguageService=inject(LanguageService);
  private __CommonService=inject(CommonService);
  isRtl=this.__LanguageService.rtlClassSignal;

  preSetVariants=this.__ProductService.variantOptions;
  defaultSelection =  this.preSetVariants().filter((option) => option.name === 'size')[0];
  variantSelection = this.isRtl()? this.defaultSelection.nameAr:this.defaultSelection.name;
  variantValues=  this.defaultSelection.values;
  variantSelectValue=this.defaultSelection.values[0];
  insertVariantNewValue:boolean=false;

  values=signal<string[]>([]);
  showColorPickerContainer: boolean = false;
  // ProductVariantOptions= signal<any>(this.__ProductService.currentProduct().variants);
  ProductVariantOptions = signal<any[]>([]);
  exitstErrorMessage:string=''
  successMessage:boolean=false;
  @Output() variants = new EventEmitter<any>();

  @ViewChildren('variantValue') variantValuesRefs!: QueryList<InputComponent>;
  @ViewChildren('colorPick') colorPickInputs!: QueryList<ElementRef>;

constructor(){
   effect(() => {
    console.log('in effeect');
    const variants:any = this.__ProductService.currentProduct().variants;
    this.ProductVariantOptions.set(variants);
  });
}

 chooseVariantName(event: any){
    this.variantValues=event.values;
    this.variantSelectValue=event.values[0];
    this.variantSelection=event.name;
    this.showColorPickerContainer = event.name === 'color' || event.name === 'اللون';
  }
 chooseOption(event: any) {
    const name=event.name || event;
    this.variantSelectValue=name;
  }

showNewValueInput(){
    this.values.update(current => [...current, '']); 
    this.insertVariantNewValue=true;
}

addNewValue() {
  let variantNewValue: any = (this.variantSelection !== 'color')
  ? this.variantValuesRefs.first?.value?.trim()
  : this.values()[0];

if (!this.variantValues.includes(variantNewValue)) {
 this.variantValues.push(variantNewValue);
const result = this.__CommonService.findItemInArray(this.preSetVariants(),(p) => p.name == this.variantSelection || p.nameAr==this.variantSelection );
if(result.exists){
this.__ProductService.updateVariant(result.item)
  .then(() => {
    this.exitstErrorMessage='';
    this.successMessage=true;
  })
  .catch(() => {
    this.exitstErrorMessage='Something went wrong';
    this.successMessage=false;
  });
  this.insertVariantNewValue=false;
  this.values.update(current => {
  const updated = [...current];
  updated.pop();
  return updated;
});;
  this.variantSelectValue=variantNewValue;
  }
}
else    { this.exitstErrorMessage="This Value is already Exist";
          this.successMessage=false;
      }
  }


  removeValue(index: number): void {
  const updated = [...this.values()]
  updated.splice(index, 1);
  this.values.set(updated);
  }

addVariant() {
  this.hideMessages();
  if(this.values().length ==1) {this.values.update(current => {
  const updated = [...current];
  updated.pop()
  return updated;
});; this.insertVariantNewValue=false}
  const newValue = this.variantSelectValue;
  const newVariant = {
    name: this.variantSelection,
    values: [newValue]
  };
  this.ProductVariantOptions.update(options => {
    const updatedOptions = [...options];
    const existingIndex = updatedOptions.findIndex(variant => variant.name === newVariant.name);

    if (existingIndex !== -1) {
      const existingValues = Array.isArray(updatedOptions[existingIndex].values)
        ? updatedOptions[existingIndex].values
        : [updatedOptions[existingIndex].values];

      if (!existingValues.includes(newValue)) {
        updatedOptions[existingIndex].values = [...existingValues, newValue];
      }
      return updatedOptions;
    } else {
      return [...options, newVariant];
    }
  });
  this.updateProductVariants();
  this.variants.emit(this.ProductVariantOptions());
}

deleteVariant() {
  this.hideMessages();
  const valueToRemove = this.variantSelectValue;
  const variantName = this.variantSelection;
  this.ProductVariantOptions.update(options => {
    const updatedOptions = [...options];
    const existingIndex = updatedOptions.findIndex(variant => variant.name === variantName);

    if (existingIndex !== -1) {
      const existingValues = Array.isArray(updatedOptions[existingIndex].values)
        ? updatedOptions[existingIndex].values
        : [updatedOptions[existingIndex].values];

      const filteredValues = existingValues.filter((value:any) => value !== valueToRemove);

      if (filteredValues.length > 0) {
        updatedOptions[existingIndex].values = filteredValues;
      } else {
        updatedOptions.splice(existingIndex, 1);
      }
    }

    return updatedOptions;
  });
    this.updateProductVariants();
  this.variants.emit(this.ProductVariantOptions());
}

updateProductVariants() {
  this.__ProductService.currentProduct.update(currentValue => {
  const updatedValue = { ...currentValue, variants: this.ProductVariantOptions() };
  return updatedValue;
});
}

private hideMessages(){
  this.successMessage=false;
  this.exitstErrorMessage='';
}
}
