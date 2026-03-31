import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListVariantProductUseCase from "../../useCases/VariantProductUseCase/ListVariantProductUseCase";

export default class ListVariantProductController extends BaseController {
    private _usecase !: ListVariantProductUseCase
  constructor(usecase :ListVariantProductUseCase) {
    super();
    this._usecase = usecase
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      

      const result = await this._usecase.execute(req.query);

      return this.ok(res, result);
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}