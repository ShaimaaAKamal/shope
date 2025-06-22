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

interface VariantType {
  id: number;
  name: string;
  nameAr: string;
}

@Component({
  selector: 'app-variant-library-item',
  standalone: false,
  templateUrl: './variant-library-item.component.html',
  styleUrl: './variant-library-item.component.scss'
})
export class VariantLibraryItemComponent {
  private __CommonService = inject(CommonService);
  private __ProductService = inject(ProductService);
  private __LanguageService = inject(LanguageService);
  private cdRef = inject(ChangeDetectorRef);

  isRtl = this.__LanguageService.dirSignal;
  variantOptions = this.__ProductService.variantOptions;

  variantTypeSelection = 'text';
  variantTypeArabicSelection = 'النص';
  variantTypes: VariantType[] = [
    { id: 1, name: 'color', nameAr: 'اللون' },
    { id: 2, name: 'text', nameAr: 'النص' },
    { id: 3, name: 'number', nameAr: 'الرقم' }
  ];

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
  }

  removeValue(id: string): void {
    this.values.set(this.values().filter(v => v.id !== id));
  }

  private addOrUpdateVariant(mode: 'add' | 'update'): void {
    const variantName = this.optionName.value?.trim();
    const variantArabicName = this.optionArabicName.value?.trim();

    if (!this.validateNames(variantName, variantArabicName)) {
      this.action.set('');
      return;
    }

    // if (mode === 'add' && this.isDuplicateVariant(variantName, variantArabicName)) {
      if (this.isDuplicateVariant(variantName, variantArabicName)) {
      this.nameErrorMessage = 'Variant already exists';
      this.action.set('');
      return;
    }

    const variantDetails = this.collectVariantDetails();
    if (!variantDetails.length) {
      this.nameErrorMessage = 'At least one value is required';
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

  private collectVariantDetails() {
    const details = [];
    const names = this.detailNameRefs.toArray();
    const namesAr = this.detailNameArRefs.toArray();
    const values = this.variantValueRefs.toArray();

    for (let i = 0; i < values.length; i++) {
      const value = values[i]?.value?.trim();
      if (value) {
        details.push({
          ...(this.variant && this.variant.variantDetails[i] && { id: this.variant.variantDetails[i].id }),
          detailNameEn: names[i]?.value?.trim() || '',
          detailNameAr: namesAr[i]?.value?.trim() || '',
          value
        });
      }
    }
    return details;
  }

  addColorValue(color: string, index: number): void {
    const ref = this.variantValueRefs.get(index);
    if (ref) ref.value = color;

    const updatedValues = [...this.values()];
    updatedValues[index].colorPickingData.value = color;
    this.values.set(updatedValues);
  }

  chooseVariantType(type: VariantType): void {
    this.variantTypeSelection = type.name;
    this.variantTypeArabicSelection = type.nameAr;
    if (type.name === 'color') this.setColorPickerValues();
  }

  setColorPickerValues(): void {
    const updated = this.values().map((v, i) => ({
      ...v,
      showColorPicker: true,
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

    if (!name) this.nameErrorMessage = 'Name is required';
    if (!arabicName) this.arabicNameErrorMessage = 'Arabic Name is required';

    return !!name && !!arabicName;
  }

  private isDuplicateVariant(name: string, arabicName: string): boolean {
    const variants = this.variantOptions();
    return this.__CommonService.findItemInArray(
      variants,
      v => (v.nameEn === name || v.nameAr === arabicName) && v.id !== this.variant?.id
    ).exists;
  }
}
