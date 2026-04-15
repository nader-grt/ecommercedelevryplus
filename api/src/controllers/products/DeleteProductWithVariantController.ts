import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import DeleteProductWithVariantUseCase from "../../useCases/productUseCase/DeleteProductWithVariantUseCase";

export default class DeleteProductWithVariantController extends BaseController {
      private _usecase: DeleteProductWithVariantUseCase;
    
      constructor(usecase: DeleteProductWithVariantUseCase) {
        super();
        this._usecase = usecase;
      }
    
      protected async executeImpl(req: Request, res: Response): Promise<any> {
        try {
          const productId = Number(req.params.id);
    
          if (!productId) {
            return this.badRequest(res, "Invalid product id");
          }
    
          const result = await this._usecase.execute(productId);
    
          if (!result.success) {
            return this.badRequest(res, result.message);
          }
    
          return this.resultValue(res, "OK", result);
    
        } catch (error: any) {
          return this.fail(res, error.message);
        }
      }
    }