import { Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import GetCompanyUseCase from "../../useCases/companyUseCase/GetCompanyUseCase";

export default class GetCompanyController extends BaseController {
  private _useCase: GetCompanyUseCase;

  constructor(useCase: GetCompanyUseCase) {
    super();
    this._useCase = useCase;
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {

        const {id} = req.params ;
        const companyId = Number(id)
      const dto = {
        id:companyId,
      };

      if (!id || isNaN(companyId)) {
        return this.fail(res, "Invalid company id");
      }

      const result = await this._useCase.execute(dto);

    

      return this.resultValue(res, 
         "Company fetched successfully",
         result.data,
      );
    } catch (error: any) {
      if (error.message === "Company not found") {
        return this.notFound(res, error.message);
      }

      return this.fail(res, error.message);
    }
  }
}