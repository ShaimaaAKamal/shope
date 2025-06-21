// import { Customer } from "./customer"
// import { Product } from "./product"
// import { SalesPerson } from "./sales-person"

import { OrderProduct } from "./order-product"

export interface Order
{
  id?:number
  customerId: number,
  userId: string,
  shiftNumber: number,
  shiftId: number,
  invoiceDate: Date,
  invoiceType: number,
  paymentMethodId: number,
  cashAmount: number,
  networkAmount: number,
  totalTax: number,
  totalDiscount: number,
  totalBeforeDiscount: number,
  totalAfterDiscount: number,
  totalBeforeTax: number,
  totalAfterTax: number,
  couponCode: string,
  stopChange: boolean,
  details:OrderProduct[]
}




