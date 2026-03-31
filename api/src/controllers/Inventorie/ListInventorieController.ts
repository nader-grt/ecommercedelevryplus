import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListInventorieUseCase from '../../useCases/InventorieUseCase/ListInventorieUseCase';



export default class ListInventorieController extends BaseController
{

         private _usecase!:ListInventorieUseCase
    constructor(usecase:ListInventorieUseCase)
    {super()
      this._usecase = usecase
    }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
        const { page, perPage, sort, order, filter } = req.query;              
        try {
                        
                      

                        const dto = {
                          page: Number(page) || 1,
                          perPage: Number(perPage) || 10,
                          sort: (sort as string) || "createdAt",
                          order: (order as string) || "DESC",
                          filter: filter ? JSON.parse(filter as string) : {},
                        };
                  
                  
                        console.log('********   ',dto, req.query)
                        const result = await this._usecase.execute(dto, req.query);

                       // console.log("rrrrrrrrrrrrr  hyyyyyyyy   ",result)

                        return this.resultValue(res,"list inventories succefuly",result.data)
                       } catch (error :any) {
                        console.error("ListInventorieController Error:", error);
      return this.fail(res, error.message);
                       }
      }
}