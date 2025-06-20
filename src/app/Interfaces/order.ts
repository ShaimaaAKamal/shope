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


// {
//   customerId: number,
//   userId: string,
//   shiftNumber: number,
//   shiftId: number,
//   invoiceDate: string,
//   invoiceType: number,
//   paymentMethodId: number,
//   cashAmount: number,
//   networkAmount: number,
//   totalTax: number,
//   totalDiscount: number,
//   totalBeforeDiscount: number,
//   totalAfterDiscount: number,
//   totalBeforeTax: number,
//   totalAfterTax: number,
//   couponCode: string,
//   stopChange: boolean,
//   details: [
//     {
//       productId: number,
//       productVariantMasterId: number,
//       distributedDiscount: number,
//       price: number,
//       tax: number,
//       discount: number,
//       soldQuantity: number,
//       remainingQuantity: number,
//       returnStatus: number
//     }
//   ]
// }
