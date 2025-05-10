import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ProductService } from '../../../../Services/Product/product.service';
import { Variant } from '../../../../Interfaces/variant';


@Component({
  selector: 'app-variants',
  standalone: false,
  templateUrl: './variants.component.html',
  styleUrl: './variants.component.scss'
})
export class VariantsComponent {
private __ProductService=inject(ProductService);
product=this.__ProductService.currentProduct;

displayVariant:boolean=false;
variantsDetails!:any[];

@Output() controlVariantsPopup=new EventEmitter<string>();
@Output() variantDetailsHandled = new EventEmitter<void>();

@Input() variants!:Variant[];


ngOnInit(): void {
this.variants=this.product().variants ?? [];
this.variantsDetails=this.product().variantsDetails ?? [];
}
ngOnChanges(changes: SimpleChanges): void {
   if(changes['variants'] && this.variants?.length == 0 )
     this.displayVariant=false;
}
showOptionsSection(){
   this.displayVariant=true;
}
setProductVariants(event:any){
  this.variants = event;
  this.product().variants = this.variants;
}

deleteVariant(index:number){
    this.variants =[... this.variants.filter((_, i) => i !== index)];
    this.product().variants=this.variants;
    if(this.variants.length == 0)
      this.product().variantsDetails=[];
    this.product.set(this.product());
}
controlVariantsPopupScreen(action:string){
this.controlVariantsPopup.emit(action);
}
variantDetailsHandledFn(){
  this.variantDetailsHandled.emit();
}
}
