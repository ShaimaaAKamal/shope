import { Component, inject } from '@angular/core';
import { ProductService } from '../../../Services/Product/product.service';
import { VartiantType } from '../../../Interfaces/vartiant-type';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-variant-type-center',
  standalone: false,
  templateUrl: './variant-type-center.component.html',
  styleUrl: './variant-type-center.component.scss'
})
export class VariantTypeCenterComponent {
 __ProductService=inject(ProductService);
VariantTypes=this.__ProductService.variantTypes;
private __LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;
popupVisible:boolean=false;
editedVariant:VartiantType={} as VartiantType;

setCurrentPage(page:number){
  this.__ProductService.variantTypePagination.goToPage(page);
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
}
