import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateVariantForProductUseCase from "../../useCases/VariantProductUseCase/CreateVariantForProductUseCase";


export default class CreateVariantForProductController extends BaseController
{

    private _usecase!:CreateVariantForProductUseCase
    constructor(usecaseCreateVariant:CreateVariantForProductUseCase)
    {super()

        this._usecase = usecaseCreateVariant
    }
     protected async executeImpl(req: Request, res: Response): Promise<any> {
         

        /**
         POST /variants

{
  "productId": 1,
  "sku": "TS-BLACK-M",
  "color": "black",
  "size": "M",
  "price": 120
}
         */
                   try {
                    const result = await this._usecase.execute(req.body);

                    return this.ok(res, result);
                   } catch (error: any) {
                    return this.fail(res, error.message);
                  }
     }
}