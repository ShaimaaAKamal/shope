import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductService } from '../../../../Services/Product/product.service';
import { VartiantType } from '../../../../Interfaces/vartiant-type';

@Component({
  selector: 'app-variant-type',
  standalone: false,
  templateUrl: './variant-type.component.html',
  styleUrl: './variant-type.component.scss'
})
export class VariantTypeComponent {
   __ProductService=inject(ProductService);
  @Output() created=new EventEmitter<VartiantType>();

  @Input() CompoenentData={
     header:'Add Variant Type',
     label:'Add Variant Type',
     item:{} as VartiantType
  }

onVariantCreated(data:any){
  this.created.emit(data);
}
}
