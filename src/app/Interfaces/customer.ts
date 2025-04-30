export interface Customer {
  name:string,
  nameAr:string,
  id:number,
  image?:string,
  phone?:string,
  status?:string,
  [key: string]: any
}
