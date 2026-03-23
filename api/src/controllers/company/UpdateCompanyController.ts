import { Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import UpdateCompanyUseCase from "../../useCases/companyUseCase/UpdateCompanyUseCase";

export default class CreateCompanyController extends BaseController {
  private useCase: UpdateCompanyUseCase;

  constructor(useCase: UpdateCompanyUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {

        const {id} = req.params ;
        const companyId = Number(id)

      const dto = {
        id:companyId,
        name: req.body.name,
        type: req.body.type,
        isActive: req.body.isActive,
      };

      const company = await this.useCase.execute(dto);



      return this.resultValue(res, 
        "Company updated successfully",
        company,
     );

    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}