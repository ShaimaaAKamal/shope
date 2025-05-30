import { Component, inject } from '@angular/core';
import { ProductService } from '../../../Services/Product/product.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';
import { VariantOption } from '../../../Interfaces/variant-option';

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


editedVariant:VariantOption={} as VariantOption;
private __ToastingMessagesService=inject(ToastingMessagesService);
showOptionsSection(){
 this.popupVisible=true;
}

closeAddVariantPopScreen(){
 this.popupVisible=false;
}

deleteVariant(variant:VariantOption){

if(variant.name == 'color')  { this.__ToastingMessagesService.showToast("Default Variant can't be deleted.", 'error');
  return;
}

this.__ProductService.deleteVariant(variant.id).subscribe();
}

editVariant(variant:VariantOption){
 this.editedVariant=variant;
}
updatedVariant(){
  this.editedVariant={} as VariantOption;
}
deleteSelected(event:any){

}
}
