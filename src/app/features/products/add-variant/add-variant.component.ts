import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { VariantOption } from '../../../Interfaces/variant-option';
import { Variant } from '../../../Interfaces/variant';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductVariantOptionsService } from '../../../Services/ProductVariantsOptions/product-variant-options.service';

@Component({
  selector: 'app-add-variant',
  standalone: false,
  templateUrl: './add-variant.component.html',
  styleUrl: './add-variant.component.scss'
})
export class AddVariantComponent {
values: any[] =  [{id: crypto.randomUUID(),type:'text',color:'#000',value:''}];
  ProductVariantOptions!: VariantOption[];
  optionSelection: string = 'Select option type';
  showColorPickerContainer: boolean = false;
  showColorPicker: boolean[] = [];
  nameErrorMessage='';
  showDeleteIcon: boolean = false;
  type:string='text';

  @Input() saveVariants:boolean=false;
  @Input() alreadyExist:boolean=false;
  @Output() variantDetails = new EventEmitter<Variant>();
  @Output() deleteAddVariant = new EventEmitter<boolean>();

  @ViewChildren('variantValue') variantValuesRefs!: QueryList<InputComponent>;
  @ViewChild('optionName') optionName!:InputComponent;
  @ViewChildren('colorPick') colorPickInputs!: QueryList<ElementRef>;

  constructor(private __ProductVariantOptionsService: ProductVariantOptionsService) {
    this.__ProductVariantOptionsService.variantOptions.subscribe({
      next: options => this.ProductVariantOptions = options
    });
  }

  ngOnInit(): void {
  this.showColorPicker = this.values.map(() => false);
}

 ngOnChanges(changes: SimpleChanges) {
    if (changes['alreadyExist']) {
       if(changes['alreadyExist'].currentValue)
        this.nameErrorMessage='Name already exist'
      else  this.nameErrorMessage='';
    }
  }
  chooseOption(event: any) {
    this.showColorPickerContainer = event.name === 'color';
    this.type=event.name;
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

addNewValue() {
    this.values.push({id: crypto.randomUUID(),value:'',color:'#000',type:this.type});
  }

removeValue(id: string): void {
  this.values = this.values.filter(v => v.id !== id);
}

addVariant() {
   if(this.showColorPickerContainer)
     this.values[0]['type']='color';
  const variantValues = [
  ...new Set(
    this.variantValuesRefs.map((inputComponent, index) => {
      const value = this.values[index];
      return value.type === 'color' ? value.color : inputComponent.value?.trim();
    }).filter(Boolean)
  )
];

  const variantName = this.optionName.value?.trim();

  if (variantName) {
    this.nameErrorMessage = '';
    const variant: Variant = {
      name: variantName,
      type:this.type,
      values: variantValues
    };
    this.variantDetails.emit(variant);
  } else {
    this.nameErrorMessage = "Name can't be empty";
  }
}

  deleteVariant() {
    this.deleteAddVariant.emit(true);
  }
}
