import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import GetVariantProductUseCase from "../../useCases/VariantProductUseCase/GetVariantProductUseCase";

export default class GetVariantsProducController extends BaseController {

    private _usecase! : GetVariantProductUseCase
  constructor(usecase : GetVariantProductUseCase) {
    super();
    this._usecase = usecase
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const variantId = Number(req.params.id);



      const result = await this._usecase.execute(variantId);

      return this.ok(res, result);
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}