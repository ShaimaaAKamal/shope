import {
  Component,
  Input,
  QueryList,
  signal,
  effect,
  ViewChildren,
  OnDestroy,
  inject,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { VariantOption } from '../../../Interfaces/variant-option';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../Services/Product/product.service';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-edit-variant',
  standalone: false,
  templateUrl: './edit-variant.component.html',
  styleUrl: './edit-variant.component.scss'
})
export class EditVariantComponent implements OnDestroy {
   private __ProductService=inject(ProductService);
  private __ToastingMessagesService=inject(ToastingMessagesService);
  private changesSub?: Subscription;

  @Input() variant!: VariantOption;
  @Output() updated=new EventEmitter<void>();
  @ViewChildren('variantValue') variantValues!: QueryList<InputComponent>;
  @ViewChildren('colorPick') colorPicks!: QueryList<InputComponent>;
  @ViewChild('name') variantName!:InputComponent;
  @ViewChild('nameAr') variantArabicName!:InputComponent;


  values = signal<string[]>([]);

  insertVariantNewValue = false;
  showColorPickerContainer = false;
  showColorPicker: boolean[] = [];
  color = '';
  viewInitialized:boolean=false;
  errorMessage='';

displayVariantValues(){
      const currentValues = this.values();
      this.variantValues?.forEach((inputComponent, index) => {
        inputComponent.value = currentValues[index];
      });
  }

displayVariantBasicInfo(){
    this.values.set(this.variant.values);
    this.variantName.value=this.variant.name;
    this.variantArabicName.value=this.variant.nameAr
  }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['variant'] && changes['variant'].currentValue) {

    if (this.viewInitialized) {
          this.displayVariantBasicInfo();

      this.displayVariantValues();
    }
  }
}
ngAfterViewInit(): void {
    this.viewInitialized=true;
      this.displayVariantBasicInfo();
      this.changesSub = this.variantValues.changes.subscribe(() => {
        this.displayVariantValues();
      });
  }

  toggleColorPicker(index: number): void {
    this.showColorPicker[index] = true;
  }

  hideColorPicker(index: number): void {
    this.showColorPicker[index] = false;
  }

  onColorChange(color: string, index: number): void {
    const updated = [...this.values()];
    updated[index] = color;
    this.values.set(updated);
    this.hideColorPicker(index);
  }

  removeValue(index: number): void {
  const updated = [...this.values()]
  updated.splice(index, 1);
  this.values.set(updated);
  }

  showNewValueInput() {
    this.values.update(current => [...current,''])
    this.insertVariantNewValue=true;
    this.errorMessage='';

  }
  addNewValue() {
  this.errorMessage='';
   const currentValues:string[]=[];
  this.variantValues?.forEach((inputComponent, index) => {
        currentValues[index] =inputComponent.value ;
      });
  const uniqueValues = [...new Set(currentValues.filter(v => v.trim() !== ''))];
   this.values.set([...uniqueValues]);
   this.insertVariantNewValue=false;
  }


updateVariant(){
const newVariant={
  id:this.variant.id,
  name:this.variantName.value.trim(),
  nameAr:this.variantArabicName.value.trim(),
  values:[...new Set(this.values().filter(v => v.trim() !== ''))]
}
 this.__ProductService.updateVariant(newVariant)
  .then(() => {
    this.__ToastingMessagesService.showToast("Variant updated successfully", 'success');
    this.errorMessage='';
    this.updated.emit();
  })
  .catch(error => {
    this.errorMessage=error.message;
  });

  }

  ngOnDestroy(): void {
    this.changesSub?.unsubscribe();
  }
}
