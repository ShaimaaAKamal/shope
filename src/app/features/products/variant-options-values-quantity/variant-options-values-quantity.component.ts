

import {  Component, effect, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Variant } from '../../../Interfaces/variant';
import { Product } from '../../../Interfaces/product';
import { VariantValueDetailsComponent } from '../variant-value-details/variant-value-details.component';
import { ProductService } from '../../../Services/Product/product.service';

@Component({
  selector: 'app-variant-options-values-quantity',
  standalone: false,
  templateUrl: './variant-options-values-quantity.component.html',
  styleUrl: './variant-options-values-quantity.component.scss'
})
export class VariantOptionsValuesQuantityComponent {
private __ProductService=inject(ProductService);
product=this.__ProductService.currentProduct;
displayedVariants:any[]=[];
displayedKeys:string[]=[];
@ViewChildren('variantValueDetails') variantValueDetailsRefs!: QueryList<VariantValueDetailsComponent>;
@Input() variants:Variant[]=[];
@Input() variantsDetails:any[]=[];
@Output() variantDetailsHandled = new EventEmitter<void>();

constructor(){
  effect(() => {
          const data = this.__ProductService.getVariantDetailsData();
          if (data) {
            console.log('in effect',data);
            this.getAllVariantValues();
            this.variantDetailsHandled.emit();
          }
        });
}
ngOnInit(): void {
    this.displayedVariants = this.product()?.variantsDetails?.length
      ? [...this.product()?.variantsDetails ?? []]
      : this.generateCombinations();
  }
ngOnChanges(changes: SimpleChanges) {

    if (changes['variants'] && !changes['variants'].firstChange){
      this.displayedVariants=this.generateCombinations();
      this.getAllVariantValues();
    }
}

generateCombinations(): any[] {
  const variants = this.variants;
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

getFullVariantName(variant:any){
    const excludedKeys = [
    'details',
  ];

  return Object.keys(variant).filter(key => !excludedKeys.includes(key));
}


getAllVariantValues() {
      setTimeout(() => {
    const values = this.variantValueDetailsRefs.map(ref => ref.getVariantDetails());
    const updatedVariants = this.displayedVariants.map((variant, index) => {
      const updatedDetails = values ? values[index] : [];
      return {
        ...variant,
        details:updatedDetails
      };
    });
    this.displayedVariants = [...updatedVariants];
    this.product().variantsDetails = this.displayedVariants;
    this.product.set ({...this.product()})
  });
}

setQuantity(newQuantity:number,index:number){
 if (this.displayedVariants && this.displayedVariants[index]) {
    this.displayedVariants[index].details.quantity = newQuantity;
  }
}

}



