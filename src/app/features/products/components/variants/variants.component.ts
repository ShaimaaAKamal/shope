import {
  Component,EventEmitter,inject,Output,signal,effect} from '@angular/core';
  import { ProductService } from '../../../../Services/Product/product.service';
import { SharedService } from '../../../../Services/Shared/shared.service';
import { ProductVariantMaster } from '../../../../Interfaces/product-variant-master';

  @Component({
    selector: 'app-variants',
    standalone: false,
    templateUrl: './variants.component.html',
    styleUrl: './variants.component.scss',
  })
  export class VariantsComponent {
    private __ProductService = inject(ProductService);
    private __SharedService = inject(SharedService);

    product = this.__ProductService.currentProduct;

    displayVariant = signal(false);

    @Output() controlVariantsPopup = new EventEmitter<string>();
    @Output() variantDetailsHandled = new EventEmitter<void>();

    localVariants = signal<any[]>([]);

    showOptionsSection() {
      this.displayVariant.set(true);
    }

    setLocalVariants(event:any){
      this.localVariants.set([...event.map((e:any) => ({ ...e }))]);
      if(this.localVariants().length == 0) this.displayVariant.set(false);
    }

    // deleteVariant(index: number) {
    //   const updated = this.localVariants().filter((_, i) => i !== index);

    //   this.localVariants.set(updated);
    // }

    controlVariantsPopupScreen(action: string) {
      this.controlVariantsPopup.emit(action);
    }

    variantDetailsHandledFn(event:any) {
      if(this.localVariants().length == 0){
        console.log('Make update array list');
        console.log(event)
        this.variantDetailsHandled.emit();
      }
      else {
         this.__SharedService.createListByPost<ProductVariantMaster[]>('CreateProductVariantList',event,'Product Variants').subscribe(
        {
          next:()=>   this.variantDetailsHandled.emit()
        }
      )
      }
    }
  }
