
import { Variant } from "./variant";

export interface Product {
  id?:number  ,
  nameEn:string,
  nameAr:string,
  barcode:string,
  sku:string,
  isActive:boolean,
  price:number,
  quantity:number,
  enfinity:boolean,
  category:number,
  descriptionEn:string,
  descriptionAr:string,
 imageUrl:string,
 vatValue:number,
  discountId:number|null,
  comparePrice:number,
  isPriceAffecting:boolean,
  chargeTax:boolean,
  tax:number,
  variants?:Variant[],
  variantsDetails?:any[],
  categoryNameAr?:string,
  categoryNameEn?:string,
    [key: string]: any
}


