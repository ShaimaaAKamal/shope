import { Variant } from "./variant";

export interface Product {
  id:number  ,
  name:string,
  nameAr:string,
  barcode:string,
  price:number,
  quantity:string,
  tax:number,
  status:string,
  weight?:number,
  weightUnit?:string,
  productCostPrice?:number,
  requireShipping?:boolean,
  salePrice?:number,
  salePriceEndDate?:string,
  category?:any,
  description?:any,
  shopOutOfStock?:boolean,
  variants?:Variant[],
  variantsDetails?:any[],
  media?:any,
    [key: string]: any
}
