import { Component, inject } from '@angular/core';
import { ProductService } from '../../../Services/Product/product.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { VariantMasterLookUP } from '../../../Interfaces/variant-master-look-up';

@Component({
  selector: 'app-variants-library',
  standalone: false,
  templateUrl: './variants-library.component.html',
  styleUrl: './variants-library.component.scss'
})
export class VariantsLibraryComponent {
private __ProductService=inject(ProductService);
VariantOptions=this.__ProductService.variantOptions

private __LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;
popupVisible:boolean=false;


editedVariant:VariantMasterLookUP={} as VariantMasterLookUP;

showOptionsSection(){
 this.popupVisible=true;
}

closeAddVariantPopScreen(){
 this.popupVisible=false;
}

deleteVariant(variant:VariantMasterLookUP){

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

