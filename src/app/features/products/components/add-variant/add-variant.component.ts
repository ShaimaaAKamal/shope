import { Component, ElementRef, EventEmitter, inject, Output, QueryList, ViewChildren, signal } from '@angular/core';
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
  defaultSelection =  this.preSetVariants().filter((option) => option.name === 'size')[0]
  variantSelection = this.isRtl()? this.defaultSelection.nameAr:this.defaultSelection.name;
  variantValues=  this.defaultSelection.values;
  variantSelectValue=this.defaultSelection.values[0];
  insertVariantNewValue:boolean=false;

  values: any[] =  [];
  showColorPickerContainer: boolean = false;
  ProductVariantOptions= signal<any>(this.__ProductService.currentProduct().variants);
  showColorPicker: boolean[] = [];


  type:string='text';
  @Output() variants = new EventEmitter<any>();

  @ViewChildren('variantValue') variantValuesRefs!: QueryList<InputComponent>;
  @ViewChildren('colorPick') colorPickInputs!: QueryList<ElementRef>;

  ngOnInit(): void {
  this.showColorPicker = this.values.map(() => false);
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
  this.__CommonService.saveToStorage('variantOptions',this.preSetVariants());
  this.insertVariantNewValue=false;
  this.values.pop();
  this.variantSelectValue=variantNewValue;
  this.variantValues=[...this.variantValues,variantNewValue]
  }

removeValue(id: string,type:string=''): void {
  if(!type) this.insertVariantNewValue=false;
  this.values = this.values.filter(v => v.id !== id);

}

addVariant() {
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
}
