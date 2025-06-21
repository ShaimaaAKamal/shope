export interface VariantMasterLookUP {
  id?:number,
  variantTypeEn: string,
  variantTypeAr: string,
  nameAr: string,
  nameEn: string,
  variantDetails:  {
  id?:number
  detailNameAr: string;
  detailNameEn: string;
  value: string;
}[]

}
