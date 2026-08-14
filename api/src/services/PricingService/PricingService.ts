export interface PricingRequest {

    companyId:number;

    customerId:number;

    productId:number;

    variantId:number;

    quantity:number;
}

export interface PricingResult {

    unitPrice:number;

    subtotal:number;

    discount:number;

    finalPrice:number;
}





export default class PricingService {

    async calculate(
        dto: PricingRequest
    ): Promise<PricingResult> {

        return {

            unitPrice:0,

            subtotal:0,

            discount:0,

            finalPrice:0
        };

    }

}