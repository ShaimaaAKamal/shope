import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VariantOption } from '../../Interfaces/variant-option';

@Injectable({
  providedIn: 'root'
})
export class ProductVariantOptionsService {
  variantOptions=new BehaviorSubject<VariantOption[]>([
    {id:1,name:'color'},
    {id:2,name:'text'},
    {id:3 , name:'image'}
  ])
  constructor() { }
}
