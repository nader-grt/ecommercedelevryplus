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

                const { ids } = req.query; // query param

       console.log("idsss********************** ",ids)
      
       let filterIds: number[] | undefined;
       if (ids) {
         filterIds = (ids as string).split(',').map(Number);
       }
               const companies = await this.listCompanyUseCase.execute(filterIds);

            console.log("object")

               return this.resultValue(res,"Companies fetched successfully",companies.data)
             } catch (error: any) {
               return this.fail(res, error.message);
             }
     }
}