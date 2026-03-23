import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import DeleteCompanyUseCase from "../../useCases/companyUseCase/DeleteCompanyUseCase";


export default class DeleteCompanyController extends BaseController
{
    private _useCase: DeleteCompanyUseCase;

    constructor(useCase: DeleteCompanyUseCase) {
      super();
      this._useCase = useCase;
    }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
           try {
            
           } catch (error) {
            
           }
      }
}