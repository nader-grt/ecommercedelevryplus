import { privateDecrypt } from "crypto";



export default class OrderItemDomain 
{



  constructor(
    private productId: number,
    private productName: string,
    private quantity: number,
    private unitPrice: number = 1 ,
    private  variantId:number
  ) {}

  getTotalPrice(): number {
    return this.quantity * this.unitPrice;
  }
  get getVariantId() { return this.variantId; }

  get getProductId() { return this.productId; }
  get getProductName() { return this.productName; }
  get getQuantity() { return this.quantity; }
  get getUnitPrice() { return this.unitPrice; }

}