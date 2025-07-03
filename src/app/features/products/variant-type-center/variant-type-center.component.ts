import { Component, inject } from '@angular/core';
import { ProductService } from '../../../Services/Product/product.service';
import { VartiantType } from '../../../Interfaces/vartiant-type';
import { LanguageService } from '../../../Services/Language/language.service';
import { CommonService } from '../../../Services/CommonService/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-variant-type-center',
  standalone: false,
  templateUrl: './variant-type-center.component.html',
  styleUrl: './variant-type-center.component.scss'
})
export class VariantTypeCenterComponent {
 __ProductService=inject(ProductService);
 __CommonService=inject(CommonService);
 page=this.__CommonService.page;
VariantTypes=this.__ProductService.variantTypes;
private __LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;
popupVisible:boolean=false;
editedVariant:VartiantType={} as VartiantType;
route=inject(ActivatedRoute);
constructor(){
  this.page.set('Variant Types');
}

ngOnInit(): void {
  this.__ProductService.paginationCtx.getStore('Variant Types')?.initFromQueryParams(this.route);
}
showOptionsSection(){
 this.popupVisible=true;
}

closeAddVariantPopScreen(){
 this.popupVisible=false;
}

deleteVariant(variant:VartiantType){
  this.editedVariant={} as VartiantType;
 if (variant.id) {
    this.__ProductService.deleteVariantType(variant.id).subscribe();
  }
}

editVariant(variant:VartiantType){
  this.editedVariant=variant;
}

updatedVariant(){
  this.editedVariant={} as VartiantType;
}
deleteSelected(event:any){

}
ngOnDestroy() {
  this.__ProductService.paginationCtx.getStore('Variant Types')?.resetPage();
}
}



