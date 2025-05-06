import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Product } from '../../../Interfaces/product';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-product-details-pop',
  standalone: false,
  templateUrl: './product-details-pop.component.html',
  styleUrl: './product-details-pop.component.scss'
})
export class ProductDetailsPopComponent {
   // Inputs
@Input() product!:Product;
@Input() saveInfo!:boolean;

  // ViewChild references
@ViewChild('productWeight') productWeight!:InputComponent;
@ViewChild('productCostPrice') productCostPrice!:InputComponent;
@ViewChild('salePrice') salePrice!:InputComponent;
@ViewChild('salePriceEndDate') salePriceEndDate!:InputComponent;
@ViewChild('barcode') barcode!:InputComponent;

    // Outputs
@Output() updated=new EventEmitter<boolean>();

weightDropDownSelection:string='KG';
dropdownSelection:string="No.Doesn't Require Delivery";
shippingOptions:any[]=[
  {title:'Yes,Require Shipping.', value:true},
 {title: "No.Doesn't Require Delivery",value:false}
]
weightOptions:any[]=[
  {title:'KG', value:'KG'},
 {title: "gram",value:'gram'}
]


constructor(private cdr:ChangeDetectorRef){}

ngAfterViewInit() {
      this.displayProductInfo();
     this.cdr.detectChanges();
}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saveInfo']) {
      const current = changes['saveInfo'].currentValue;

      if (current === true) {
        this.getProductInfo();
      }
    }
  }
displayProductInfo(){
  const { weight, productCostPrice, salePrice, salePriceEndDate,weightUnit,barcode,requireShipping} = this.product ?? {};
  this.productWeight.value = weight?.toString() ?? '';
  this.productCostPrice.value = productCostPrice?.toString() ?? '';
  this.barcode.value = barcode ?? null;
  this.salePriceEndDate.value = (salePriceEndDate && salePrice)?salePriceEndDate : '';
  if(weightUnit)
    this.weightDropDownSelection =weightUnit;
   if(salePrice)
    this.salePrice.value = salePrice?.toString()
    this.dropdownSelection =requireShipping?'Yes,Require Shipping.':"No.Doesn't Require Delivery";
  }

changeSelect(method:any,key:string){
  this.product[key]=method.value;
  if(key == 'weightUnit') this.weightDropDownSelection=method.value;
}

getProductInfo(): void {
  const weight = parseFloat(this.productWeight.value);
  const costPrice = parseFloat(this.productCostPrice.value);
  const salePrice = parseFloat(this.salePrice.value);
  const salePriceEndDate =this.salePriceEndDate.value? new Date(this.salePriceEndDate.value).toISOString().split('T')[0]:'';
  const barcode = this.barcode.value;
  Object.assign(this.product, {
    weight,
    weightUnit: weight ? this.weightDropDownSelection : '',
    productCostPrice: costPrice,
    salePrice,
    barcode,
    salePriceEndDate
  });

  this.updated.emit(true);
}
}
