import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductService } from '../../../../Services/Product/product.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { CommonService } from '../../../../Services/CommonService/common.service';
import { ToastingMessagesService } from '../../../../Services/ToastingMessages/toasting-messages.service';
import { VariantOption } from '../../../../Interfaces/variant-option';

@Component({
  selector: 'app-create-variant',
  standalone: false,
  templateUrl: './create-variant.component.html',
  styleUrl: './create-variant.component.scss'
})
export class CreateVariantComponent {
  private __CommonService=inject(CommonService);
  private __ProductService=inject(ProductService);
  private __ToastingMessagesService=inject(ToastingMessagesService);

  variantOptions=this.__ProductService.variantOptions;

  nameErrorMessage:string='';
  arabicNameErrorMessage:string='';

  values: any[] =  [];

@ViewChild('optionName') optionName!:InputComponent ;
@ViewChild('optionArabicName') optionArabicName!:InputComponent ;

@ViewChildren('variantValue') variantValuesRefs!: QueryList<InputComponent>;
@Output() closeAddVariantPopScreen=new EventEmitter<void>();

addNewValue() {
    this.values.push({id: crypto.randomUUID(),value:'',color:'#000'});
  }

removeValue(id: string): void {
  this.values = this.values.filter(v => v.id !== id);
}

async add() {
  const variantValues = this.getUniqueTrimmedValues();
  const variantName = this.optionName.value?.trim();
  const variantArabicName = this.optionArabicName.value?.trim();

  if (!this.validateNames(variantName, variantArabicName)) return;

  if (this.isDuplicateVariant(variantName, variantArabicName)) {
    this.nameErrorMessage = 'Variant already exists';
    return;
  }

   if (variantValues.length === 0) {
    this.nameErrorMessage = 'At least one value is required';
    return;
  }

  const newVariant = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: variantName,
    nameAr: variantArabicName,
    values: variantValues
  };
  this.__ProductService.createVariant(newVariant).then(() => {
  this.__ToastingMessagesService.showToast('Variant created successfully', 'success');
  this.closeAddVariantPopScreen.emit();
});
}
private getUniqueTrimmedValues(): string[] {
  return Array.from(new Set(
    this.variantValuesRefs
      .map(input => input.value?.trim())
      .filter(Boolean)
  ));
}

private validateNames(name: string, arabicName: string): boolean {
  this.nameErrorMessage = '';
  this.arabicNameErrorMessage = '';

  let isValid = true;

  if (!name) {
    this.nameErrorMessage = 'Name is required';
    isValid = false;
  }

  if (!arabicName) {
    this.arabicNameErrorMessage = 'Arabic Name is required';
    isValid = false;
  }

  return isValid;
}

private isDuplicateVariant(name: string, arabicName: string): boolean {
  const variants = this.variantOptions();
  const result = this.__CommonService.findItemInArray(
    variants,
    v => v.name === name || v.nameAr === arabicName
  );
  return result.exists;
}
  close(){
     this.closeAddVariantPopScreen.emit();
  }
}
