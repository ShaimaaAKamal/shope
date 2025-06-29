export interface ProductVariantMaster {
  id?:number,
  productId: number,
  price: number,
  comparePrice: number,
  chargeTax: boolean,
  costPerItem: number,
  profit: number,
  margin: number,
  barcode: string,
  sku: string,
  isPriceAffecting: boolean,
  imageUrl: string,
  vatValue: number,
  discountId: number,
  quantity:number,
  variantDetails: [
    {
      variantMasterLookUpId: number,
      variantDetailId: number
    }
  ],
  [key: string]: any

}


