import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";

import DeleteVariantForProductUseCase from "../../useCases/VariantProductUseCase/DeleteVariantForProductUseCase";

export default class DeleteVariantForProductController extends BaseController {

  private _useCase: DeleteVariantForProductUseCase;

  constructor(usecase:DeleteVariantForProductUseCase) {
    super();

    //const repo = new VariantProductRepo();
    this._useCase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
console.log("controlleriddd  ",id)
      if (!id) {
        return this.fail(res,"Variant id is required" );
      }

      const result = await this._useCase.execute(Number(id));

      return this.ok(res,result);

    } catch (error: any) {
      return this.fail(res,"fialed ")
    }
  }
}