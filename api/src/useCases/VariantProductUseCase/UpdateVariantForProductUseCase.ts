import VariantDomain from "../../models/domain/VariantDomain/VariantDomain";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";


export default class UpdateVariantForProductUseCase
{
           private _repo!:VariantProductRepo
            constructor(repo:VariantProductRepo)
            {
                  this._repo = repo 
            }

            async execute(data:any):Promise<any>
            {
                  const { id, color, size, price, sku } = data;
                  try {

                 
                         console.log("  usecase updated variants ",data)
                        // 1. get variant
                        const variant = await this._repo.getVariantById(id);
                    
                        if (variant.product.type === "SIMPLE") {
                              throw new Error("Cannot update variant for SIMPLE product");
                            }


                            const existingCombo = await this._repo.findDuplicateCombination(
                              variant.productId,
                              color ?? variant.color,
                              size ?? variant.size,
                              id
                            );
                      
                            if (existingCombo) {
                              throw new Error("Variant combination already exists");
                            }


                            if (sku) {
                              const existingSku = await this._repo.findBySku(sku);
                              if (existingSku && existingSku.id !== id) {
                                throw new Error("SKU already exists");
                              }
                            }


                            const domain = new VariantDomain(
                              color,
                              size,
                              price,
                              sku,
                            );


                            const updated = await this._repo.updateVariant(id, {
                              ...domain.toObject(),
                            });
                      
                            return updated;
                  } catch (error :any) {
                        throw new Error(error.message);
                  }
            }
}