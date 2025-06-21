import {  Component, effect, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ProductService } from '../../../../Services/Product/product.service';
import { Product } from '../../../../Interfaces/product';

@Component({
  selector: 'app-product-details-pop',
  standalone: false,
  templateUrl: './product-details-pop.component.html',
  styleUrl: './product-details-pop.component.scss'
})
export class ProductDetailsPopComponent {
  // ViewChild references
// @ViewChild('productWeight') productWeight!:InputComponent;
// @ViewChild('salePrice') salePrice!:InputComponent;
// @ViewChild('salePriceEndDate') salePriceEndDate!:InputComponent;
// @ViewChild('productCostPrice') productCostPrice!:InputComponent;
@ViewChild('descriptionEn') descriptionEn!:InputComponent;
@ViewChild('descriptionAr') descriptionAr!:InputComponent;
@ViewChild('productComparePrice') productComparePrice!:InputComponent;
@ViewChild('tax') tax!:InputComponent;
@ViewChild('vatValue') vatValue!:InputComponent;
@ViewChild('barcode') barcode!:InputComponent;
@ViewChild('SKU') SKU!:InputComponent;

    // Outputs
@Output() updated=new EventEmitter<boolean>();
@Output() close=new EventEmitter<boolean>();
// chargeTax:boolean=false
// isActive:boolean=true;
// isPriceAffecting:boolean=false;
private __ProductService=inject(ProductService);
product=this.__ProductService.currentProduct;
// weightDropDownSelection:string='KG';
ActiveDropDownSelection:string='Active';
chargeTaxDropDownSelection:string='Charge';
priceAffecringDropDownSelection:string='yes'
// dropdownSelection:string="No.Doesn't Require Delivery";
// shippingOptions:any[]=[
//  {title:'Yes,Require Shipping.', value:true},
//  {title: "No.Doesn't Require Delivery",value:false}
// ]
ActiveOptions:any[]=[
{title:'Active', value:true},
 {title: "Inactive",value:false}
]
ChargeTax:any[]=[
{title:'Charge', value:true},
 {title: "Uncharge",value:false}
]
PriceAffecting:any[]=[
{title:'yes', value:true},
 {title: "no",value:false}
]
// weightOptions:any[]=[
// {title:'KG', value:'KG'},
//  {title: "gram",value:'gram'}
// ]


constructor(){
   effect(() => {
    setTimeout(() => this.displayProductInfo());
  });
}
closeProductPopscreen(){
this.close.emit()
}
saveProductDetails(){
  this.getProductInfo();
}

displayProductInfo(){
  // const { weight, productCostPrice, salePrice, salePriceEndDate,weightUnit,barcode,requireShipping} = this.product() ?? {};
  const { sku,comparePrice,barcode,isActive,isPriceAffecting,descriptionEn,descriptionAr,chargeTax,tax,vatValue} = this.product() ?? {};
  // this.productWeight.value = weight?.toString() ?? '';
  // this.productCostPrice.value = productCostPrice?.toString() ?? '';
  this.barcode.value = barcode ?? null;
  this.SKU.value = sku ?? null;
  this.descriptionEn.value = descriptionEn ?? '';
  this.descriptionAr.value = descriptionAr ?? '';
  this.productComparePrice.value = comparePrice?.toString() ?? '';
  this.ActiveDropDownSelection= isActive ? 'Active' : 'Inactive';
  this.chargeTaxDropDownSelection = chargeTax ? 'Charge' : 'Uncharge';
  this.priceAffecringDropDownSelection = isPriceAffecting ? 'yes' : 'no';
  this.tax.value = tax?.toString() ?? '';
  this.vatValue.value = vatValue?.toString() ?? '';
  // this.salePriceEndDate.value = (salePriceEndDate && salePrice)?salePriceEndDate : '';
  // if(weightUnit)
  //   this.weightDropDownSelection =weightUnit;
  //  if(salePrice)
  //   this.salePrice.value = salePrice?.toString()
  //   this.dropdownSelection =requireShipping?'Yes,Require Shipping.':"No.Doesn't Require Delivery";
  }

changeSelect(method:any,key:string){
  this.product()[key]=method.value;
  // if(key == 'weightUnit') this.weightDropDownSelection=method.value;
   if(key == 'isActive') this.ActiveDropDownSelection=method.title;
    if(key == 'chargeTax') this.chargeTaxDropDownSelection=method.title;
    if(key == 'isPriceAffecting') this.priceAffecringDropDownSelection=method.title;
}

// getProductInfo(): void {
//   const weight = parseFloat(this.productWeight.value);
//   const costPrice = parseFloat(this.productCostPrice.value);
//   const salePrice = parseFloat(this.salePrice.value);
//   const salePriceEndDate =this.salePriceEndDate.value? new Date(this.salePriceEndDate.value).toISOString().split('T')[0]:'';
//   const barcode = this.barcode.value;
//   const id=this.product().id
//   this.__ProductService.currentProduct.set({
//     ...this.product(),
//     weight,
//     weightUnit: weight ? this.weightDropDownSelection : '',
//     productCostPrice: costPrice,
//     salePrice,
//     barcode,
//     salePriceEndDate
//   });
//   // this.updated.emit(true);
//   if(id)
//   this.__ProductService.patchProduct({
//     id,
//     weight,
//     weightUnit: weight ? this.weightDropDownSelection : '',
//     productCostPrice: costPrice,
//     salePrice,
//     barcode,
//     salePriceEndDate
//   }).subscribe({
//     next:()=> this.close.emit(true)
//   });


// }
getProductInfo(): void {
  const sku=this.SKU.value;
  const descriptionEn = this.descriptionEn.value;
  const descriptionAr = this.descriptionAr.value;
  const tax = parseFloat(this.tax.value);
  const vatValue = parseFloat(this.vatValue.value);
  const comparePrice= parseFloat(this.productComparePrice.value);
  const isActive = this.ActiveDropDownSelection === 'Active';
  const chargeTax = this.chargeTaxDropDownSelection === 'Charge';
  const isPriceAffecting = this.priceAffecringDropDownSelection === 'yes';
  // const costPrice = parseFloat(this.productCostPrice.value);
  const barcode = this.barcode.value;
  const id=this.product().id
  this.__ProductService.currentProduct.set({
    ...this.product(),
    sku,
    descriptionEn,
    descriptionAr,
    tax,
    barcode,
    vatValue,
    comparePrice,
    isActive,
    chargeTax,
    isPriceAffecting
  });
  // this.updated.emit(true);
  if(id)
     this.__ProductService.updateProduct(this.__ProductService.currentProduct()).subscribe({
    next:()=> this.close.emit(true)
  });

}
}
