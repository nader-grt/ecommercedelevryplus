import { Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateCompanyUseCase from "../../useCases/companyUseCase/CreateCompanyUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class CreateCompanyController extends BaseController {
  private _useCase: CreateCompanyUseCase;

  constructor(useCase: CreateCompanyUseCase) {
    super();
    this._useCase = useCase;
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {
      const dto = {
        name: req.body.name,
        type: req.body.type,
      };

      const result = await this._useCase.execute(dto);

      return this.ok(res, result);

    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}