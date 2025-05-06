import { ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Variant } from '../../../Interfaces/variant';
import { Product } from '../../../Interfaces/product';
import { VariantValueDetailsComponent } from '../variant-value-details/variant-value-details.component';

@Component({
  selector: 'app-variant-options-values-quantity',
  standalone: false,
  templateUrl: './variant-options-values-quantity.component.html',
  styleUrl: './variant-options-values-quantity.component.scss'
})
export class VariantOptionsValuesQuantityComponent {

displayedVariants:any[]=[];
displayedKeys:string[]=[];
@ViewChildren('variantValueDetails') variantValueDetailsRefs!: QueryList<VariantValueDetailsComponent>;
@Input() variants:Variant[]=[];
@Input() product!:Product;
@Input() variantsDetails:any[]=[];
@Input() saveVariants:boolean=false
@Output() updated=new EventEmitter<any>();

ngOnInit(): void {
    this.displayedVariants = this.product?.variantsDetails?.length
      ? [...this.product.variantsDetails]
      : this.generateCombinations();

  }
constructor(private cdRef: ChangeDetectorRef){}
ngOnChanges(changes: SimpleChanges) {

    if (changes['variants'] && !changes['variants'].firstChange){
      this.displayedVariants=this.generateCombinations();
      this.getAllVariantValues();
    }
      if(changes['saveVariants'] && changes['saveVariants'].currentValue){
      this.getAllVariantValues();
    }
    //   if(changes['product']){
    //   console.log('product chnges');
    // }
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
    this.product.variantsDetails = this.displayedVariants;
        this.cdRef.detectChanges();
        if(this.saveVariants)
             this.emitNewValue();
  });
}

emitNewValue(){
this.updated.emit(true);
}

setQuantity(newQuantity:number,index:number){
 if (this.displayedVariants && this.displayedVariants[index]) {
    this.displayedVariants[index].details.quantity = newQuantity;
  }
}
// Incase we save one by one
// updateVariantDetailsValue(variantDetails:any,updatedIndex:number){
//   this.displayedVariants = this.displayedVariants.map((variant, index) => {
//     if (index === updatedIndex) {
//       return {
//         ...variant,
//         details: {
//           ...variant.details,
//           ...variantDetails
//         }
//       };
//     }
//     return variant;
//   });
//   this.updated.emit(this.displayedVariants);
// }
}
