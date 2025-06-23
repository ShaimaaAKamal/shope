import { Component, ElementRef, EventEmitter, inject, Output, signal, effect, ViewChild } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ProductService } from '../../../../Services/Product/product.service';
import { LanguageService } from '../../../../Services/Language/language.service';
import { CommonService } from '../../../../Services/CommonService/common.service';
interface variantDetailInterface {
  variantMasterLookUpId:number,
  variantDetailId: number
}
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

  @Output() localVariants=new EventEmitter<any>();

  @ViewChild('detailName') detailName!: InputComponent;
  @ViewChild('detailNameAr') detailNameAr!: InputComponent;
  @ViewChild('variantValue') variantValue!:InputComponent;
  @ViewChild('colorPick') colorPickInputs!: ElementRef;


  variantDetailId!:number;


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
  this.variantValues= this.defaultSelection.variantDetails;
  this.variantSelectValue=this.defaultSelection.variantDetails[0].value;
  this.defaultSelection.variantDetails[0].id && ( this.variantDetailId=this.defaultSelection.variantDetails[0].id);
    if(this.defaultSelection.variantTypeEn == 'color' ||  this.defaultSelection.variantTypeAr == 'اللون' ) this.showColorPickerContainer=true;
}
   }
 chooseVariantName(event: any){
    this.variantValues= event.variantDetails;
    this.variantSelectValue=this.variantValues[0].value;
    this.variantDetailId=this.variantValues[0].id
    this.VariantMasterLookUPId = event.id;
    this.variantSelection=!this.isRtl()?event.nameEn:event.nameAr;
    this.showColorPickerContainer = (this.defaultSelection.variantTypeEn == 'color' ||  this.defaultSelection.variantTypeAr == 'اللون' )
  }
 chooseOption(event: any) {
    const value=event.value || event;
    this.variantSelectValue=value;
    this.variantDetailId=event.id

  }
showNewValueInput(){
  this.showNewlibraryVariantValue=true;
  this.insertVariantNewValue=true;
}
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

addLocalVariant() {
  const newValue = this.variantSelectValue;
  const newVariant = {
    name: this.variantSelection,
    values: [{ value: newValue, variantDetailId: this.variantDetailId }],
    variantMasterLookUpId: this.VariantMasterLookUPId,
  };

  this.ProductVariantOptions.update(options => {
    const updatedOptions = [...options];
    const existingIndex = updatedOptions.findIndex(variant => variant.name === newVariant.name);

    if (existingIndex !== -1) {
      const existingValues = Array.isArray(updatedOptions[existingIndex].values)
        ? updatedOptions[existingIndex].values
        : [updatedOptions[existingIndex].values];

      const alreadyExists = existingValues.some((v:any) => v.value === newValue);

      if (!alreadyExists) {
        updatedOptions[existingIndex].values = [
          ...existingValues,
          { value: newValue, variantDetailId: this.variantDetailId }
        ];
      }

      return updatedOptions;
    } else {
      return [...options, newVariant];
    }
  });

  this.localVariants.emit(this.ProductVariantOptions());
}

addVariant() {
  this.hideMessages();
  this.addLocalVariant();
}

closeAddVariantPopScreen(){
    this.showAddLibraryVariant = false;
    this.defaultSelection = this.preSetVariants()[0];
    this.setDefaultValues();

}

deleteVariant() {
  this.hideMessages();

  const variantMasterLookUpId = this.VariantMasterLookUPId;
  const variantDetailId = this.variantDetailId;

  this.ProductVariantOptions.update(options => {
    let updatedOptions = [...options];

    const variantIndex = updatedOptions.findIndex(
      variant => variant.variantMasterLookUpId === variantMasterLookUpId
    );

    if (variantIndex !== -1) {
      const variant = updatedOptions[variantIndex];
      const filteredValues = variant.values.filter(
        (v: any) => v.variantDetailId !== variantDetailId
      );

      if (filteredValues.length === 0) {
        updatedOptions.splice(variantIndex, 1);
      } else {
        updatedOptions[variantIndex] = {
          ...variant,
          values: filteredValues
        };
      }
    }

    return updatedOptions;
  });

  this.localVariants.emit(this.ProductVariantOptions());
}


private hideMessages(){
  this.exitstErrorMessage='';
}
}
