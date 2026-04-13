import VariantDomain from "../../models/domain/VariantDomain/VariantDomain";
import ProductRepo from "../../repo/productRepo/productRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class CreateVariantForProductUseCase
{

   private _productRepo: ProductRepo;
   private _variantRepo: VariantProductRepo;
 
   constructor(productRepo: ProductRepo, variantRepo: VariantProductRepo) {
     this._productRepo = productRepo;
     this._variantRepo = variantRepo;
   }

     async execute(dto :any):Promise<any>
     {

      const { productId, sku, color, size, price } = dto;
        try {
                  // 1. check product exists
      const product = await this._productRepo.GetProductById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

           const existingVariant = await this._variantRepo.findBySku(sku);

   


       
      if (existingVariant) {
        throw new Error("Variant SKU already exists");
      }

      // Domain 
    
      const domain = new VariantDomain(
        color,
        size,
        price,
      
      );
      // duplicate check
      const duplicate = await this._variantRepo.findDuplicateCombination(
        dto.productId,
        domain.getColor,
        domain.getSize
      );
  
      if (duplicate) {
        throw new Error("Variant already exists");
      }
  

      // 3. create variant
      const variant = await this._variantRepo.addVariantIfExistInProducts({
        productId,
        sku,
        color,
        size,
        price,
      });

      return variant;
    
        } catch (error) {
         throw error;
        }
     }
}