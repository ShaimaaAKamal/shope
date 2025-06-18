export interface ProductVariantMaster {
  id?:number,
  productId: number,
  variantMasterLookUpId: number,
  variantTypeEn: string,
  variantTypeAr: string,
  nameAr: string,
  nameEn: string,
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
  variantDetails: [
    {
      value: string
    }
  ]
}
