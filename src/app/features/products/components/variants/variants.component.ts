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


    controlVariantsPopupScreen(action: string) {
      this.controlVariantsPopup.emit(action);
    }

    variantDetailsHandledFn(event:any) {
      if(this.localVariants().length == 0){
        const updateVariants =this.mapUpdatedProductVariantsData(event);
        this.__ProductService.updateProductVariants(updateVariants).subscribe({
          next:()=>   this.variantDetailsHandled.emit()
        })
      }
      else {
         this.__SharedService.createListByPost<ProductVariantMaster[]>('CreateProductVariantList',event,'Product Variants').subscribe(
        {
          next:()=>   this.variantDetailsHandled.emit()
        }
      )
      }
    }

    private mapUpdatedProductVariantsData(event: any) {
      const transformedVariants = event.map((variant: any) => {
        const {
          variantTypeAr,
          variantTypeEn,
          nameAr,
          nameEn,
          ...rest
        } = variant;

        return {
          ...rest,
          variantDetails: variant.variantDetails.map((detail: any) => ({
            variantMasterLookUpId: detail.variantMasterLookupId,
            variantDetailId: detail.variantDetailsLookupId
          }))
        };
      });

      return transformedVariants;
    }
  }
