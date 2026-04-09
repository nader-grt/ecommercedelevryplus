import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ConvertProductToVariableUseCase from "../../useCases/VariantProductUseCase/ConvertProductToVariableUseCase";


export default class ConvertProductToVariableController extends BaseController
{
      private _usecase!:ConvertProductToVariableUseCase
      constructor(usecase :ConvertProductToVariableUseCase)
      {super()
        this._usecase = usecase
      }

    protected async executeImpl(req: Request, res: Response): Promise<any> {
        const productId = Number(req.params.id);
                    try {
                        
                       
  console.log("object")

 
                      console.log("convertttttttt  ",productId)
                        const result = await this._usecase.execute(productId);
                    
                        return this.ok(res, result);
                      } catch (error: any) {
                        return this.fail(res, error.message);
                      }
    }
}