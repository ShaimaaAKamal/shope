
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
  discountId:number,
  comparePrice:number,
  isPriceAffecting:boolean,
  chargeTax:boolean,
  tax:number,
  variants?:Variant[],
  variantsDetails?:any[],
    [key: string]: any
}



// export interface Product {
//   id:number  ,
//   name:string,
//   nameAr:string,
//   barcode:string,
//   price:number,
//   quantity:string,
//   tax:number,
//   status:string,
//   weight?:number,
//   weightUnit?:string,
//   productCostPrice?:number,
//   requireShipping?:boolean,
//   salePrice?:number,
//   salePriceEndDate?:string,
//   category?:any,
//   description?:any,
//   shopOutOfStock?:boolean,
//   variants?:Variant[],
//   variantsDetails?:any[],
//   media?:any,
//     [key: string]: any
// }


