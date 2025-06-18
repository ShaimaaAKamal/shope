import {Component,effect,EventEmitter,inject,Output,QueryList,ViewChildren,input} from '@angular/core';
import { VariantValueDetailsComponent } from '../variant-value-details/variant-value-details.component';
import { ProductService } from '../../../../Services/Product/product.service';
import { Variant } from '../../../../Interfaces/variant';

interface variantOptionInterface {
  variants: Variant[],
  variantsDetails: any[]
}

@Component({
  selector: 'app-variant-options-values-quantity',
  standalone: false,
  templateUrl: './variant-options-values-quantity.component.html',
  styleUrl: './variant-options-values-quantity.component.scss'
})
export class VariantOptionsValuesQuantityComponent {
  private __ProductService = inject(ProductService);
  product = this.__ProductService.currentProduct;

  displayedVariants: any[] = [];
  displayedKeys: string[] = [];

  readonly variantOptionsData = input<variantOptionInterface>({
    variants: [],
    variantsDetails: []
  });

  @Output() variantDetailsHandled = new EventEmitter<void>();
  @ViewChildren('variantValueDetails') variantValueDetailsRefs!: QueryList<VariantValueDetailsComponent>;
   private firstChange=true;
constructor() {
  effect(() => {
    const data = this.variantOptionsData();
    if (data.variants.length > 0 && !this.firstChange) {
      this.displayedVariants = this.generateCombinations();
      this.getAllVariantValues();
    }
    this.firstChange=false
  });

    effect(() => {
      const data = this.__ProductService.getVariantDetailsData();
      if (data) {
        this.getAllVariantValues();
        this.variantDetailsHandled.emit();
      }
    });
  }

ngOnInit(): void {
    const hasDetails = !!this.product()?.variantsDetails?.length;
    this.displayedVariants = hasDetails
      ? [...this.product()?.variantsDetails ?? []]
      : this.generateCombinations();

}
  generateCombinations(): any[] {
    const variants = this.variantOptionsData().variants;
    const defaultDetails = {
      barcode: "",
      costPrice: "",
      notify: "",
      price: "",
      quantity: "0",
      salePrice: "",
      weight: ""
    };

    return variants.reduce((acc, variant) => {
      if (acc.length === 0) {
        return variant.values.map(value => ({
          [variant.name]: { value, type: variant.type },
          details: { ...defaultDetails }
        }));
      }

      return acc.flatMap(combo =>
        variant.values.map(value => ({
          ...combo,
          [variant.name]: { value, type: variant.type },
          details: { ...defaultDetails }
        }))
      );
    }, [] as any[]);
  }

  getFullVariantName(variant: any) {
    const excludedKeys = ['details'];
    return Object.keys(variant).filter(key => !excludedKeys.includes(key));
  }

  getAllVariantValues() {
    setTimeout(() => {
      const values = this.variantValueDetailsRefs.map(ref => ref.getVariantDetails());
      const updatedVariants = this.displayedVariants.map((variant, index) => {
        const updatedDetails = values ? values[index] : [];
        return {
          ...variant,
          details: updatedDetails
        };
      });
      this.displayedVariants = [...updatedVariants];
      this.product().variantsDetails = this.displayedVariants;
      this.product.set({ ...this.product() });
      // this.__ProductService.updateProduct(this.product()).subscribe();
    });
  }

  setQuantity(newQuantity: number, index: number) {
    if (this.displayedVariants && this.displayedVariants[index]) {
      this.displayedVariants[index].details.quantity = newQuantity;
    }
  }
}
