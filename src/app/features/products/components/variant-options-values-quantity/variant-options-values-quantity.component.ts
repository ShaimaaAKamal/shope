import {Component,effect,EventEmitter,inject,Output,QueryList,ViewChildren, Input, signal, SimpleChanges} from '@angular/core';
import { VariantValueDetailsComponent } from '../variant-value-details/variant-value-details.component';
import { ProductService } from '../../../../Services/Product/product.service';
import { Product } from '../../../../Interfaces/product';
import { LanguageService } from '../../../../Services/Language/language.service';


@Component({
  selector: 'app-variant-options-values-quantity',
  standalone: false,
  templateUrl: './variant-options-values-quantity.component.html',
  styleUrl: './variant-options-values-quantity.component.scss'
})
export class VariantOptionsValuesQuantityComponent {
  private __ProductService = inject(ProductService);
  private __LanguageService=inject(LanguageService);

  isRtl=this.__LanguageService.dirSignal;
  product = this.__ProductService.currentProduct;

  productDetails=signal<Product>({} as Product);
  displayedVariants: any[] = [];
  displayedKeys: string[] = [];


  @Input() localVariants!: any;

  @Output() variantDetailsHandled = new EventEmitter<any>();
  @ViewChildren('variantValueDetails') variantValueDetailsRefs!: QueryList<VariantValueDetailsComponent>;

constructor() {
if(this.product().id){
  const id:number=this.product().id!;
 const requestBody={
    sorts: [],
    filters: [
      {
        operation:0 ,
        propertyName: "productId",
        propertyValue: this.product().id
      }
    ],
    pagingModel: {
      index: 0,
      length: 0,
      all: true
    },
    properties: ''
  };
  // this.__ProductService.getProductVariants(requestBody).subscribe({
  //   next:(data)=>{
  //       this.displayedVariants =[...data?? []];
  //       console.log('this.displayedVariants',this.displayedVariants);
  //   }
  // });
  this.__ProductService.getProductVariants(requestBody).subscribe({
    next:(data)=>{
        this.displayedVariants =[...data.data?? []];
    }
  });
}

  effect(() => {
      const data = this.__ProductService.getVariantDetailsData();
      if (data) {
        this.getAllVariantValues();
      }
    });
  }


ngOnChanges(changes: SimpleChanges): void {
   if(changes['localVariants']){
    if(this.localVariants.length == 0 && this.productDetails())
      this.displayedVariants=[...this.productDetails().variantMasters ?? []]!
    else
    this.displayedVariants=this.generateCombinations();
   }
}



generateCombinations(): any[] {
  const variants = this.localVariants;
  const defaultDetails = {
    productId: this.product().id,
    imageUrl: "",
    discountId: null,
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

  const combinations = variants.reduce((acc: any[], variant: any) => {
    if (acc.length === 0) {
      return variant.values.map((value: any) => ({
        variantDetails: [
          {
            variantMasterLookUpId: variant.variantMasterLookUpId,
            variantDetailId: value.variantDetailId
          }
        ],
        ...defaultDetails
      }));
    }

    return acc.flatMap((combo: any) =>
      variant.values.map((value: any) => ({
        variantDetails: [
          ...(combo.variantDetails || []),
          {
            variantMasterLookUpId: variant.variantMasterLookUpId,
            variantDetailId: value.variantDetailId
          }
        ],
        ...defaultDetails
      }))
    );
  }, []);
  return combinations;
}

  getAllVariantValues() {
    setTimeout(() => {
      const values = this.variantValueDetailsRefs.map(ref => ref.getVariantDetails());
      const updatedVariants = this.displayedVariants.map((variant, index) => {
        const updatedDetails = values ? values[index] : [];
        console.log('variant',variant);
        const ret={
          ...variant,
        ...updatedDetails
        }
        return ret;
      });
      this.displayedVariants = [...updatedVariants];
      console.log('displayedVariants',this.displayedVariants);
      this.variantDetailsHandled.emit(this.displayedVariants);
    });
  }

  setQuantity(newQuantity: number, index: number) {
    if (this.displayedVariants && this.displayedVariants[index]) {
      this.displayedVariants[index].quantity = newQuantity;

    }
  }


}
