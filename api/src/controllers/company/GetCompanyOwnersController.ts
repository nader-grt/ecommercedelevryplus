import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetCompanyOwnersUseCase from "../../useCases/companyUseCase/GetCompanyOwnersUseCase";

export default class GetCompanyOwnersController extends BaseController {
  private usecase: GetCompanyOwnersUseCase;

  constructor(usecase: GetCompanyOwnersUseCase) {
    super();
    this.usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const result = await this.usecase.execute();

      return this.ok(res, {
        message: "Owners fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}