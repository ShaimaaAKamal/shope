import { Component, ElementRef, EventEmitter, inject, Output, QueryList, ViewChildren, signal, Input, effect, ViewChild } from '@angular/core';
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
  defaultSelection = this.preSetVariants()[0];
  variantSelection !:string;
  VariantMasterLookUPId!:number;
  variantValues!:any;
  variantSelectValue!:string;
  insertVariantNewValue:boolean=false;

  values=signal<string[]>([]);
  showColorPickerContainer: boolean = false;
  ProductVariantOptions = signal<any[]>([]);
  exitstErrorMessage:string=''
  showAddLibraryVariant:boolean=false;
  showNewlibraryVariantValue:boolean=false;
  @Output() variants = new EventEmitter<any>();

  @ViewChild('detailName') detailName!: InputComponent;
  @ViewChild('detailNameAr') detailNameAr!: InputComponent;
  @ViewChild('variantValue') variantValue!:InputComponent;
  @ViewChild('colorPick') colorPickInputs!: ElementRef;

  // @ViewChildren('detailName') detailNameRefs!: QueryList<InputComponent>;
  // @ViewChildren('detailNameAr') detailNameArRefs!: QueryList<InputComponent>;
  // @ViewChildren('variantValue') variantValueRefs!: QueryList<InputComponent>
  // @ViewChildren('colorPick') colorPickInputs!: QueryList<ElementRef>;


constructor(){
   effect(() => {
    const variants:any = this.__ProductService.currentProduct().variants;
    // this.ProductVariantOptions.set(variants );
        this.ProductVariantOptions.set(variants ?? [] );
  });
}

ngOnInit(): void {
    this.setDefaultValues();
}
displayCreateVariantLibrary(){
  this.showAddLibraryVariant = true;
}
 setDefaultValues(){
  if(this.defaultSelection){
  this.variantSelection = this.isRtl()? this.defaultSelection.nameAr:this.defaultSelection.nameEn;
  this.defaultSelection.id && (this.VariantMasterLookUPId = this.defaultSelection.id);
  this.variantValues=  this.getVariantValues(this.defaultSelection.variantDetails);
  this.variantSelectValue=this.defaultSelection.variantDetails[0].value;
    if(this.defaultSelection.nameEn == 'color' ) this.showColorPickerContainer=true;
}
   }

 chooseVariantName(event: any){
    this.variantValues=this.getVariantValues(event.variantDetails);
    this.variantSelectValue=this.variantValues[0];
    this.VariantMasterLookUPId = event.id;
    this.variantSelection=event.nameEn;
    this.showColorPickerContainer = event.nameEn === 'color' || event.nameEn === 'اللون';
  }
 chooseOption(event: any) {
    const name=event.nameEn || event;
    this.variantSelectValue=name;
  }
showNewValueInput(){
  this.showNewlibraryVariantValue=true;
  this.insertVariantNewValue=true;
}
// showNewValueInput(){
//     this.values.update(current => [...current, '']);
//     this.insertVariantNewValue=true;
// }

setPickedColorValue(color:string){
this.variantValue.value=color;
}
addNewValue() {
if(this.variantSelection == 'color' && !this.variantValue.value)
    this.variantValue.value="#000";
 let variantNewValue: string =  this.variantValue.value.trim();
if(!variantNewValue || !this.detailName.value || !this.detailNameAr.value)
{  this.exitstErrorMessage="can't have empty fields";
  return;
}
if (!this.variantValues.includes(variantNewValue)) {
    this.variantValues.push(variantNewValue);
    const result = this.__CommonService.findItemInArray(
      this.preSetVariants(),
      (p) => p.nameEn == this.variantSelection || p.nameAr == this.variantSelection
    );
    if (result.exists) {
      console.log('what about adding new value in update variant case');
        result.item.variantDetails.push({
          detailNameEn: this.detailName.value.trim(),
          detailNameAr: this.detailNameAr.value.trim(),
          value: this.variantValue.value.trim()
        });
      this.__ProductService.updateVariant(result.item).subscribe({
        next: () => {
          this.exitstErrorMessage = '';
        },
        error: () => {
          this.exitstErrorMessage = 'Something went wrong';
        },
        complete: () => {
          this.insertVariantNewValue = false;
          this.showNewlibraryVariantValue=false;

          // this.values.update(current => {
          //   const updated = [...current];
          //   updated.pop();
          //   return updated;
          // });

          this.variantSelectValue = variantNewValue;
          return;
        }
      });
    }
  } else {
    this.exitstErrorMessage = "This Value is already Exist";
    return;
  }
}
removeValue(): void {
this.showNewlibraryVariantValue=false;
this.insertVariantNewValue=false;
  }


addVariant() {
  this.hideMessages();
//   if(this.values().length ==1) {this.values.update(current => {
//   const updated = [...current];
//   updated.pop()
//   return updated;
// });; this.insertVariantNewValue=false}
  const newValue = this.variantSelectValue;
  const newVariant = {
    variantMasterLookUpId: this.VariantMasterLookUPId,
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
closeAddVariantPopScreen(){
    this.showAddLibraryVariant = false;
    this.defaultSelection = this.preSetVariants()[0];
    this.setDefaultValues();

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

getVariantValues(arr:any[]){
return  arr.map((value:any) => value.value)
}
private hideMessages(){
  // this.successMessage=false;
  this.exitstErrorMessage='';
}
}
