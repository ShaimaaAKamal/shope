import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonService } from '../../../Services/CommonService/common.service';
import { ProductService } from '../../../Services/Product/product.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { VariantMasterLookUP } from '../../../Interfaces/variant-master-look-up';
import { VartiantType } from '../../../Interfaces/vartiant-type';
interface FieldErrors {
  detailName: string;
  detailNameAr: string;
  variantValue: string;
}

@Component({
  selector: 'app-variant-library-item',
  standalone: false,
  templateUrl: './variant-library-item.component.html',
  styleUrl: './variant-library-item.component.scss'
})
export class VariantLibraryItemComponent {
  private __CommonService = inject(CommonService);
   __ProductService = inject(ProductService);
  private __LanguageService = inject(LanguageService);
  private cdRef = inject(ChangeDetectorRef);

  isRtl = this.__LanguageService.rtlClassSignal;
  variantOptions = this.__ProductService.variantOptions;

  variantTypeSelection = 'text';
  variantTypeArabicSelection = 'النص';

   variantTypes=this.__ProductService.variantTypes;


  nameErrorMessage = '';
  arabicNameErrorMessage = '';
  viewInitialized = false;

  values = signal<any[]>([
    {
      id: crypto.randomUUID(),
      showColorPicker: false,
      colorPickingData: { value: '', index: 0, values: signal([]) },
      variantDetails: []
    }
  ]);

  @ViewChild('optionName') optionName!: InputComponent;
  @ViewChild('optionArabicName') optionArabicName!: InputComponent;
  @ViewChildren('detailNameAr') detailNameArRefs!: QueryList<InputComponent>;
  @ViewChildren('detailName') detailNameRefs!: QueryList<InputComponent>;
  @ViewChildren('variantValue') variantValueRefs!: QueryList<InputComponent>;

  @Output() updated = new EventEmitter<void>();
  @Output() closeAddVariantPopScreen = new EventEmitter<void>();
  @Input() variant!: VariantMasterLookUP;
  @Input() action = signal<string>('');

   errors = signal<FieldErrors[]>([
    { detailName: '', detailNameAr: '', variantValue: '' }
   ]);
  constructor() {
    effect(() => {
      if (this.action() === 'add') this.addOrUpdateVariant('add');
      if (this.action() === 'update') this.addOrUpdateVariant('update');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variant']?.currentValue && this.viewInitialized) {
      this.displayVariantBasicInfo();
      this.displayVariantValues();
    }
  }

  ngAfterViewInit(): void {
    if (!this.variant) return;
    this.viewInitialized = true;
    this.displayVariantBasicInfo();
    this.displayVariantValues();
  }

  displayVariantBasicInfo(): void {
    const {
      variantTypeEn = 'text',
      variantTypeAr = 'النص',
      nameEn = '',
      nameAr = '',
      variantDetails = []
    } = this.variant;

    this.variantTypeSelection = variantTypeEn;
    this.variantTypeArabicSelection = variantTypeAr;
    this.optionName.value = nameEn;
    this.optionArabicName.value = nameAr;

    const newValues = variantDetails.map((detail, index) => ({
      id: crypto.randomUUID(),
      detail,
      ...(variantTypeEn === 'color' && {
        showColorPicker: true,
        colorPickingData: {
          value: detail.value,
          index,
          values: signal([])
        }
      })
    }));

    const newErrors = variantDetails.map(() => ({
      detailName: '',
      detailNameAr: '',
      variantValue: ''
    }))
    this.errors.set(newErrors);
    this.values.set(newValues);
    this.cdRef.detectChanges();
  }

 displayVariantValues(): void {
  this.variant.variantDetails.forEach((detail, i) => {
    const nameRef = this.detailNameRefs.get(i);
    const nameArRef = this.detailNameArRefs.get(i);
    const valueRef = this.variantValueRefs.get(i);

    if (nameRef) nameRef.value = detail.detailNameEn;
    if (nameArRef) nameArRef.value = detail.detailNameAr;
    if (valueRef) valueRef.value = detail.value;
  });
}

  addNewValue(): void {
    const showColorPicker = this.variantTypeSelection === 'color';
    this.values.set([
      ...this.values(),
      {
        id: crypto.randomUUID(),
        showColorPicker,
        colorPickingData: {
          value: '',
          index: this.values().length,
          values: signal([])
        }
      }
    ]);
  this.errors.update(prev => [
    ...prev,
    { detailName: '', detailNameAr: '', variantValue: '' }
  ]);
  }

  removeValue(id: string): void {
    const index = this.values().findIndex(v => v.id === id);
    if (index !== -1) {
      this.values.update(prev => prev.filter((_, i) => i !== index));
      this.errors.update(prev => prev.filter((_, i) => i !== index));
    }
  }

  private addOrUpdateVariant(mode: 'add' | 'update'): void {
    const variantName = this.optionName.value?.trim();
    const variantArabicName = this.optionArabicName.value?.trim();

    if (!this.validateNames(variantName, variantArabicName)) {
      this.action.set('');
      return;
    }

      if (this.isDuplicateVariant(variantName, variantArabicName)) {
      this.nameErrorMessage = 'Variant already exists';
      this.action.set('');
      return;
    }

    const variantDetails = this.collectVariantDetails();
    if (this.hasAnyErrors()) {
      this.action.set('');
      return;
    }
    const newVariant: VariantMasterLookUP = {
      ...(mode === 'update' && { id: this.variant.id }),
      variantTypeEn: this.variantTypeSelection,
      variantTypeAr: this.variantTypeArabicSelection,
      nameAr: variantArabicName,
      nameEn: variantName,
      variantDetails
    };

    const serviceCall =
      mode === 'add'
        ? this.__ProductService.createVariant(newVariant)
        : this.__ProductService.updateVariant(newVariant);

    serviceCall.subscribe({
      next: () => {
        if (mode === 'add') {
          this.closeAddVariantPopScreen.emit();
        } else {
          this.updated.emit();
        }
      }
    });
  }


  hasAnyErrors(): boolean {
    return this.errors().some(error =>
      !!error.detailName || !!error.detailNameAr || !!error.variantValue
    );
  }


  private collectVariantDetails() {
    const details = [];
    const names = this.detailNameRefs.toArray();
    const namesAr = this.detailNameArRefs.toArray();
    const values = this.variantValueRefs.toArray();

    const updatedErrors: FieldErrors[] = [];

    for (let i = 0; i < values.length; i++) {
      const value = values[i]?.value?.trim();
      const name = names[i]?.value?.trim() || '';
      const nameAr = namesAr[i]?.value?.trim() || '';

      const fieldError: FieldErrors = {
        detailName: '',
        detailNameAr: '',
        variantValue: '',
      };

      let isValid = true;

      const result = this.__CommonService.validatenNameInputs(name, nameAr);
      if (!result.status) {
        isValid = false;

        for (const err of result.errors) {
          if (err.errorType === 'missing_Name') {
            fieldError.detailName = err.message;
          } else if (err.errorType === 'missing_Arabic_Name') {
            fieldError.detailNameAr = err.message;
          }
        }
      }

      // Validate value field
      if (!value) {
        isValid = false;
        fieldError.variantValue = 'Value is required';
      }

      updatedErrors.push(fieldError);

      // Push valid variant detail
      if (isValid) {
        details.push({
          ...(this.variant?.variantDetails?.[i] && { id: this.variant.variantDetails[i].id }),
          detailNameEn: name,
          detailNameAr: nameAr,
          value
        });
      }
    }

    this.errors.set(updatedErrors);
    return details;
  }

  addColorValue(color: string, index: number): void {
    const ref = this.variantValueRefs.get(index);
    if (ref) ref.value = color;

    const updatedValues = [...this.values()];
    updatedValues[index].colorPickingData.value = color;
    this.values.set(updatedValues);
  }

  chooseVariantType(type: VartiantType): void {
    this.variantTypeSelection = type.nameEn;
    this.variantTypeArabicSelection = type.nameAr;
    const isColor = type.nameEn === 'color';
    this.setPickerValues(isColor);
  }

  private setPickerValues(showColorPicker: boolean): void {
    const updated = this.values().map((v, i) => ({
      ...v,
      showColorPicker,
      colorPickingData: v.colorPickingData || {
        value: '',
        index: i,
        values: signal([])
      }
    }));
    this.values.set(updated);

  }


  private validateNames(name: string, arabicName: string): boolean {
    this.nameErrorMessage = '';
    this.arabicNameErrorMessage = '';

    const result = this.__CommonService.validatenNameInputs(name, arabicName);

    if (!result.status) {
      for (const err of result.errors) {
        if (err.errorType === 'missing_Name') {
          this.nameErrorMessage = err.message;
        } else if (err.errorType === 'missing_Arabic_Name') {
          this.arabicNameErrorMessage = err.message;
        }
      }
      return false;
    }

    return true;
  }

  private isDuplicateVariant(name: string, arabicName: string): boolean {
    const variants = this.variantOptions();
    return this.__CommonService.findItemInArray(
      variants,
      v => (v.nameEn === name || v.nameAr === arabicName) && v.id !== this.variant?.id
    ).exists;
  }
}
