import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Variant } from '../../../Interfaces/variant';
import { ProductService } from '../../../Services/Product/product.service';
import { Product } from '../../../Interfaces/product';

@Component({
  selector: 'app-variants',
  standalone: false,
  templateUrl: './variants.component.html',
  styleUrl: './variants.component.scss'
})
export class VariantsComponent {
@Input() product!:Product;
@Input() saveVariants:boolean=false;
@Output() updatedProduct=new EventEmitter<boolean>();
displayVariant:boolean=false;
// variants!:Variant[];

@Input() variants!:Variant[];
variantsDetails!:any[];
addNewVariantVar:boolean=false;
alreadyExist:boolean=false;


constructor(private __ProductsService:ProductService){}


ngOnInit(): void {
this.variants=this.product.variants ?? [];
this.variantsDetails=this.product.variantsDetails ?? [];
}
ngOnChanges(changes: SimpleChanges): void {
   if(changes['variants'] && this.variants?.length == 0 )
     this.displayVariant=false;
}
showOptionsSection(){
   this.displayVariant=true;
}
getVariantValue(variant:Variant){
  const trimmedName = variant.name.trim();
  const exists = this.variants.some(v => v.name.toLowerCase() === trimmedName.toLowerCase());
  if (trimmedName && !exists) {
    if(variant.values.length > 0)
    this.variants=[...this.variants,variant]
    this.displayVariant=false;
    this.alreadyExist=false;
    this.product.variants=this.variants;
  }
  else this.alreadyExist=true;
}
deleteAddVariant(del:boolean){
  this.displayVariant=!del;
}
deleteVariant(index:number){
    this.variants =[... this.variants.filter((_, i) => i !== index)];
    this.product.variants=this.variants;
    if(this.variants.length == 0)
      this.product.variantsDetails=[];
}
updateVariant(index:number){}

addNewVariant(){
this.addNewVariantVar=true;
}

addProductVariantsDetails(updated:boolean){
  this.updatedProduct.emit(updated);
}
}
