import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  signal,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  WritableSignal
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

interface ColorPickingInterface {
  value: string;
  index: number;
  values: WritableSignal<string[]>;
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
  // @Input() variant!: VariantMasterLookUP;
  isRtl = this.__LanguageService.dirSignal;

  variantOptions = this.__ProductService.variantOptions;

  variantTypeSelection: string = 'text';
  variantTypeArabicSelection: string = 'النص';
  variantTypes: VariantType[] = [
    { id: 1, name: 'color', nameAr: 'اللون' },
    { id: 2, name: 'text', nameAr: 'النص' },
    { id: 3, name: 'number', nameAr: 'الرقم' }
  ];

  nameErrorMessage: string = '';
  arabicNameErrorMessage: string = '';

  values: any[] = [
    {
      id: crypto.randomUUID(),
      showColorPicker: false,
      colorPickingData: {
        value: '',
        index: 0,
        values: signal([])
      }
    }
  ];

  @ViewChild('optionName') optionName!: InputComponent;
  @ViewChild('optionArabicName') optionArabicName!: InputComponent;
  @ViewChildren('detailNameAr') detailNameArRefs!: QueryList<InputComponent>;
  @ViewChildren('detailName') detailNameRefs!: QueryList<InputComponent>;
  @ViewChildren('variantValue') variantValueRefs!: QueryList<InputComponent>;

  @Output() closeAddVariantPopScreen = new EventEmitter<void>();

  @Input() action=signal<string>('');

  // ngAfterViewInit(): void {
  // if(this.variant) {
  //     this.variantTypeSelection = this.variant.variantTypeEn || 'text';
  //     this.variantTypeArabicSelection = this.variant.variantTypeAr || 'النص';
  //     this.optionName.value = this.variant.nameEn || '';
  //     this.optionArabicName.value = this.variant.nameAr || '';
  //   //   this.values = this.variant.variantDetails.map((detail, index) => ({
  //   //     id: crypto.randomUUID(),
  //   //     showColorPicker: this.variantTypeSelection === 'color',
  //   //     colorPickingData: {
  //   //       value: detail.value,
  //   //       index: index,
  //   //       values: signal([])
  //   //     }
  //   //   }));
  //   // }
  //       //  this.values = this.variant.variantDetails
  //   }
  // }

  constructor(){
  effect(() => {
      if(this.action() == 'add') this.add();
    });
  }


  addNewValue() {
    const showColorPickerVar = this.variantTypeSelection === 'color';
    this.values.push({
      id: crypto.randomUUID(),
      showColorPicker: showColorPickerVar,
      colorPickingData: {
        value: '',
        index: this.values.length,
        values: signal([])
      }
    });
  }

  removeValue(id: string): void {
    this.values = this.values.filter(v => v.id !== id);
  }

  add() {
    const variantName: string = this.optionName.value?.trim();
    const variantArabicName: string = this.optionArabicName.value?.trim();

    if (!this.validateNames(variantName, variantArabicName)) {
this.action.set('');
    return};

    if (this.isDuplicateVariant(variantName, variantArabicName)) {
      this.nameErrorMessage = 'Variant already exists';
      this.action.set('');
      return;
    }

    const detailNames = this.detailNameRefs.toArray();
    const detailNamesAr = this.detailNameArRefs.toArray();
    const variantValues = this.variantValueRefs.toArray();

    const variantDetails = [];

    for (let i = 0; i < variantValues.length; i++) {
      const value = variantValues[i]?.value?.trim();
      const detailName = detailNames[i]?.value?.trim() || '';
      const detailNameAr = detailNamesAr[i]?.value?.trim() || '';

      if (value) {
        variantDetails.push({
          detailNameEn: detailName,
          detailNameAr: detailNameAr,
          value: value
        });
      }
    }

    if (variantDetails.length === 0) {
      this.nameErrorMessage = 'At least one value is required';
            this.action.set('');
      return;
    }

    const newVariant: VariantMasterLookUP = {
      variantTypeEn: this.variantTypeSelection,
      variantTypeAr: this.variantTypeArabicSelection,
      nameAr: variantArabicName,
      nameEn: variantName,
      variantDetails
    };
    this.__ProductService.createVariant(newVariant).subscribe({
      next: () => this.closeAddVariantPopScreen.emit()
    });
  }

  addColorValue(color: string, index: number) {
    const refAtIndex = this.variantValueRefs.get(index);
    if (refAtIndex) {
      refAtIndex.value = color;
    }
    this.values[index].colorPickingData.value = color;
  }

  chooseVariantType(type: VariantType) {
    this.variantTypeSelection = type.name;
    this.variantTypeArabicSelection = type.nameAr;
    if (type.name === 'color') this.setColorPickerValues();
  }

  setColorPickerValues() {
    this.values.forEach((value, index) => {
      value.showColorPicker = true;
      if (!value.colorPickingData) {
        value.colorPickingData = {
          value: '',
          index: index,
          values: signal([])
        };
      }
    });
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
      v => v.nameEn === name || v.nameAr === arabicName
    );
    return result.exists;
  }

}
