import {Component,Input,QueryList,signal,ViewChildren,OnDestroy,inject,Output,EventEmitter,ViewChild,SimpleChanges} from '@angular/core';
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
  showColorPickerContainer =signal<boolean>(false);
  color = '#000';
  viewInitialized:boolean=false;
  errorMessage='';

displayVariantValues(){
      const currentValues = this.values();
      if(this.variant.name == 'color' || this.variant.nameAr == 'اللون'){
         this.showColorPickerContainer.set(true);
      }
      else
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
    this.resetColorPicker();
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

  resetColorPicker(){
        this.insertVariantNewValue=false;
        if(this.variant.name != 'color' )
    {   this.showColorPickerContainer.set(false)}
  }

  removeValue(index: number): void {
  const updated = [...this.values()]
  updated.splice(index, 1);
  this.values.set(updated);
  }

  showNewValueInput() {
    const newValue=(this.variant.name == 'color') ? '#000' : '';
    this.values.update(current => [...current,newValue])
    this.insertVariantNewValue=true;
    this.errorMessage='';
  }

  addNewValue() {
  this.errorMessage = '';

  if (this.variant.name !== 'color') {
    const currentValues = this.variantValues?.map(vc => vc.value.trim()) || [];
    const uniqueValues = Array.from(new Set(currentValues.filter(v => v !== '')));

    if (uniqueValues.length < currentValues.length) {
      this.errorMessage = 'This New added Value is already existed';
    }

    this.values.set(uniqueValues);
  } else {
    const allValues = this.values().map(v => v.trim());
    const uniqueValues = Array.from(new Set(allValues));

    if (uniqueValues.length < allValues.length) {
      this.errorMessage = 'This New added Value is already existed';
    }

    this.values.set(uniqueValues);
  }

  this.insertVariantNewValue = false;
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
