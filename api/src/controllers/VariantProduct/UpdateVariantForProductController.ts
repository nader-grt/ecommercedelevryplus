import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateVariantForProductUseCase from "../../useCases/VariantProductUseCase/UpdateVariantForProductUseCase";

export default class UpdateVariantForProductController extends BaseController {
  private _usecase!: UpdateVariantForProductUseCase;
  constructor(usecase: UpdateVariantForProductUseCase) {
    super();
    this._usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    /*  let data:any = {
          id: Number(req.params.id),
          sku: req.body.sku,
          color: req.body.color,
          size: req.body.size,
          price: req.body.price,
        };*/
    try {
      const data = {
        id: Number(req.params.id),
        ...req.body,
      };

      console.log("  updated variant " ,data)
      const result = await this._usecase.execute(data);

      return this.ok(res, result);
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}
