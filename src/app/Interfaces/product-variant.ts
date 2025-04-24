export interface ProductVariant {
  pirce?:number,
  costPrice?:number
  salePrice?:number,
  barcode:string,
  weight?:number,
  quantity:string,
  notifyQuantity?:string,
  [key: string]: any;
}
