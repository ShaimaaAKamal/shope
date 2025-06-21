// import {Component,effect,EventEmitter,inject,Output,QueryList,ViewChildren,input} from '@angular/core';
// import { VariantValueDetailsComponent } from '../variant-value-details/variant-value-details.component';
// import { ProductService } from '../../../../Services/Product/product.service';
// import { Variant } from '../../../../Interfaces/variant';

// interface variantOptionInterface {
//   variants: Variant[],
//   variantsDetails: any[]
// }

// @Component({
//   selector: 'app-variant-options-values-quantity',
//   standalone: false,
//   templateUrl: './variant-options-values-quantity.component.html',
//   styleUrl: './variant-options-values-quantity.component.scss'
// })
// export class VariantOptionsValuesQuantityComponent {
//   private __ProductService = inject(ProductService);
//   product = this.__ProductService.currentProduct;

//   displayedVariants: any[] = [];
//   displayedKeys: string[] = [];

//   readonly variantOptionsData = input<variantOptionInterface>({
//     variants: [],
//     variantsDetails: []
//   });

//   @Output() variantDetailsHandled = new EventEmitter<void>();
//   @ViewChildren('variantValueDetails') variantValueDetailsRefs!: QueryList<VariantValueDetailsComponent>;
//    private firstChange=true;
// constructor() {

//   effect(() => {
//     console.log('in variantOptionsData');
//     const data = this.variantOptionsData();
//     if (data.variants.length > 0 && !this.firstChange) {
//       console.log('genetate combonaton');
//       this.displayedVariants = this.generateCombinations();
//       this.getAllVariantValues();
//     }
//     this.firstChange=false
//   });

//     effect(() => {
//       console.log('in getVariantDetailsData');
//       const data = this.__ProductService.getVariantDetailsData();
//       if (data) {
//         this.getAllVariantValues();
//         this.variantDetailsHandled.emit();
//       }
//     });
//   }

// ngOnInit(): void {
//   console.log('details' ,this.product());
//     const hasDetails = !!this.product()?.variantsDetails?.length;
//     this.displayedVariants = hasDetails
//       ? [...this.product()?.variantsDetails ?? []]
//       : this.generateCombinations();

// }
//   generateCombinations(): any[] {
//     const variants = this.variantOptionsData().variants;
//     const defaultDetails = {
//       barcode: "",
//       costPrice: "",
//       notify: "",
//       price: "",
//       quantity: "0",
//       salePrice: "",
//       weight: ""
//     };

//     return variants.reduce((acc, variant) => {
//       if (acc.length === 0) {
//         return variant.values.map(value => ({
//           [variant.name]: { value, type: variant.type },
//           details: { ...defaultDetails }
//         }));
//       }

//       return acc.flatMap(combo =>
//         variant.values.map(value => ({
//           ...combo,
//           [variant.name]: { value, type: variant.type },
//           details: { ...defaultDetails }
//         }))
//       );
//     }, [] as any[]);
//   }

//   getFullVariantName(variant: any) {
//     const excludedKeys = ['details'];
//     return Object.keys(variant).filter(key => !excludedKeys.includes(key));
//   }

//   getAllVariantValues() {
//     setTimeout(() => {
//       const values = this.variantValueDetailsRefs.map(ref => ref.getVariantDetails());
//       const updatedVariants = this.displayedVariants.map((variant, index) => {
//         const updatedDetails = values ? values[index] : [];
//         return {
//           ...variant,
//           details: updatedDetails
//         };
//       });
//       this.displayedVariants = [...updatedVariants];
//       console.log('displayedVariants',this.displayedVariants);
//       this.product().variantsDetails = this.displayedVariants;
//       this.product.set({ ...this.product() });
//       // this.__ProductService.updateProduct(this.product()).subscribe();
//     });
//   }

//   setQuantity(newQuantity: number, index: number) {
//     if (this.displayedVariants && this.displayedVariants[index]) {
//       this.displayedVariants[index].details.quantity = newQuantity;
//     }
//   }
// }

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
  this.__ProductService.getProductVariants().subscribe({
    next:(data)=>console.log('productVARIANTScOMPONENT',data)
  });
  effect(() => {
    console.log('in variantOptionsData');
    const data = this.variantOptionsData();
    if (data.variants.length > 0 && !this.firstChange) {
      console.log('genetate combonaton');
      this.displayedVariants = this.generateCombinations();
      this.getAllVariantValues();
    }
    this.firstChange=false
  });

    effect(() => {
      console.log('in getVariantDetailsData');
      const data = this.__ProductService.getVariantDetailsData();
      if (data) {
        this.getAllVariantValues();
        this.variantDetailsHandled.emit();
      }
    });
  }

ngOnInit(): void {
  console.log('details' ,this.product());
    const hasDetails = !!this.product()?.variantsDetails?.length;
    this.displayedVariants = hasDetails
      ? [...this.product()?.variantsDetails ?? []]
      : this.generateCombinations();

}

generateCombinations(): any[] {
  const variants = this.variantOptionsData().variants;
   const defaultDetails = {
    productId:this.product().id,
    imageUrl:"",
    discountId:0,
    price: 0,
    comparePrice: 0,
    costPerItem: 0,
    profit: 0,
    margin: 0,
    vatValue: 0,
    barcode: "",
    sku: "",
    chargeTax: false,
    isPriceAffecting: false,
    quantity: 0
  };

  const combinations = variants.reduce((acc, variant) => {
    if (acc.length === 0) {
      return variant.values.map(value => ({
        variantDetails: [
          {
            variantMasterLookUpId: variant.variantMasterLookUpId,
            variantDetailId: value
          }
        ],
        ...defaultDetails
      }));
    }

    return acc.flatMap(combo =>
      variant.values.map(value => ({
        variantDetails: [
          ...(combo.variantDetails || []),
          {
            variantMasterLookUpId: variant.variantMasterLookUpId,
            variantDetailId: value
          }
        ],
        ...defaultDetails
      }))
    );
  }, [] as any[]);

  console.log('Generated Combinations:', combinations);
  return combinations;
}


  getFullVariantName(variant: any) {
    // console.log(variant.variantDetails);
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
      console.log('displayedVariants',this.displayedVariants);
      // this.product().variantsDetails = this.displayedVariants;
      // this.product.set({ ...this.product() });
      // this.__ProductService.updateProduct(this.product()).subscribe();
    });
  }


  setQuantity(newQuantity: number, index: number) {
    if (this.displayedVariants && this.displayedVariants[index]) {
      this.displayedVariants[index].details.quantity = newQuantity;
    }
  }
}

