import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateWareHouseUseCase from "../../useCases/WareHouseUseCase/CreatWareHouseUseCase";


export default class CreatWareHouseController extends BaseController
{
            private _usecase :CreateWareHouseUseCase
            constructor(usecase :CreateWareHouseUseCase)
            {super()

                  this._usecase = usecase

            }
           protected async executeImpl(req: Request, res: Response): Promise<any> {
            const { name, location, companyId } = req.body;
                 try {
                    
                  if (!name || !location || !companyId) {
                        return this.fail(res, "Missing required fields");
                      }
                
                      const warehouse = await this._usecase.execute({
                        name,
                        location,
                        companyId,
                      });
                
                      return this.ok(res, {
                        message: "Warehouse created successfully",
                        data: warehouse,
                      });
                

                 } catch (error:any) {
      if (error.message === "Company not found") {
            return this.notFound(res, error.message);
          }
    
          if (error.message === "Warehouse already exists for this company") {
            return this.conflict(res, error.message);
          }
    
          return this.fail(res, "Internal server error");
                 }
           }
}