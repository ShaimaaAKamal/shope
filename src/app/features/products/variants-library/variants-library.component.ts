import { Component, inject } from '@angular/core';
import { ProductService } from '../../../Services/Product/product.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { VariantMasterLookUP } from '../../../Interfaces/variant-master-look-up';
import { ServiceInterface } from '../../../Interfaces/service-interface';
import { CommonService } from '../../../Services/CommonService/common.service';

@Component({
  selector: 'app-variants-library',
  standalone: false,
  templateUrl: './variants-library.component.html',
  styleUrl: './variants-library.component.scss'
})
export class VariantsLibraryComponent {
 __ProductService=inject(ProductService);
private __CommonService=inject(CommonService);
private __LanguageService=inject(LanguageService);

page=this.__CommonService.page;
VariantOptions=this.__ProductService.variantOptions

isRtl=this.__LanguageService.rtlClassSignal;
popupVisible:boolean=false;
editedVariant:VariantMasterLookUP={} as VariantMasterLookUP;
servicesList:ServiceInterface[]=[]

constructor(){
  this.page.set('Variants');
}
setCurrentPage(page:number){
  this.__ProductService.variantLookMasterPagination.goToPage(page);
}
showOptionsSection(){
 this.popupVisible=true;
}

closeAddVariantPopScreen(){
 this.popupVisible=false;
}

deleteVariant(variant:VariantMasterLookUP){
  this.editedVariant={} as VariantMasterLookUP;
 if (variant.id) {
    this.__ProductService.deleteVariant(variant.id).subscribe();
  }
}

editVariant(variant:VariantMasterLookUP){
 this.editedVariant=variant;
}

updatedVariant(){
  this.editedVariant={} as VariantMasterLookUP;
}
deleteSelected(event:any){

}
}

