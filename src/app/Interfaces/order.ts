import { Customer } from "./customer"
import { Product } from "./product"
import { SalesPerson } from "./sales-person"

export interface Order {
  id:number,
  code:string,
  status:string,
  products:Product[],
  grossTotal:number,
  discount:number,
  paymentMethods:{
    cash:number,
    network:number,
    masterCard:number
  },
  salesPerson:SalesPerson,
  customer:Customer,
  time:Date,
  currency?:string,
  hasARetrun?:boolean,
  remainingQty?:number
}
