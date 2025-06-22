export interface OrderProduct {
      id?:number,
      productId: number,
      productVariantMasterId: number,
      distributedDiscount: number,
      price: number,
      tax: number,
      discount: number,
      soldQuantity: number,
      remainingQuantity: number,
      returnStatus: number

}
