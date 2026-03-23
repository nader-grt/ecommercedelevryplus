import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListCompanyUseCase from "../../useCases/companyUseCase/ListCompanyUseCase";


export default class ListCompanyController extends BaseController
{

     private listCompanyUseCase: ListCompanyUseCase;

     constructor(listCompanyUseCase: ListCompanyUseCase) {
       super();
       this.listCompanyUseCase = listCompanyUseCase;
     }
     protected async executeImpl(req: Request, res: Response): Promise<any> {
              try {
               const companies = await this.listCompanyUseCase.execute();

            console.log("object")

               return this.resultValue(res,"Companies fetched successfully",companies.data)
             } catch (error: any) {
               return this.fail(res, error.message);
             }
     }
}