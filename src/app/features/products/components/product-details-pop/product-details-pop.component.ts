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

private __ProductService=inject(ProductService);
product=this.__ProductService.currentProduct;
ActiveDropDownSelection:string='Active';
chargeTaxDropDownSelection:string='Charge';
priceAffecringDropDownSelection:string='yes'

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
  const { sku,comparePrice,barcode,isActive,isPriceAffecting,descriptionEn,descriptionAr,chargeTax,tax,vatValue} = this.product() ?? {};
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
  }

changeSelect(method:any,key:string){
  this.product()[key]=method.value;
   if(key == 'isActive') this.ActiveDropDownSelection=method.title;
    if(key == 'chargeTax') this.chargeTaxDropDownSelection=method.title;
    if(key == 'isPriceAffecting') this.priceAffecringDropDownSelection=method.title;
}

getProductInfo(): void {
  const sku=this.SKU.value;
  const descriptionEn = this.descriptionEn.value;
  const descriptionAr = this.descriptionAr.value;
  const tax = isNaN(parseFloat(this.tax.value)) ? 0 : parseFloat(this.tax.value);
  const vatValue = isNaN(parseFloat(this.vatValue.value)) ? 0 : parseFloat(this.vatValue.value);
  const comparePrice = isNaN(parseFloat(this.productComparePrice.value)) ? 0 : parseFloat(this.productComparePrice.value);
  const isActive = this.ActiveDropDownSelection === 'Active';
  const chargeTax = this.chargeTaxDropDownSelection === 'Charge';
  const isPriceAffecting = this.priceAffecringDropDownSelection === 'yes';
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
        this.updated.emit(true);

  //    this.__ProductService.updateProduct(this.__ProductService.currentProduct()).subscribe({
  //   next:()=> this.close.emit(true)
  // });

}

}
