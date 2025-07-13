import { OrderProduct } from "./order-product"

export interface Order
{
  id?:number,
  customerId: number,
  userId: string,
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
  InvoiceDetails:OrderProduct[],
  invoiceNumber?:number,
  shiftNumber?:number,
  customerName?:string,
  paymentMethodName?:string
  [key: string]: any
}




