import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ReserveStockUseCase from "../../useCases/InventorieUseCase/ReserveStockUseCase";
import { RequestAuth } from "../../middleware/verifyToken";


export default class ReserveStockController  extends BaseController
{

        private _useCase!:ReserveStockUseCase
          constructor(useCase:ReserveStockUseCase)
          {super()
                 this._useCase  = useCase
          }
       protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
           

        console.log("RESERVE FROM STOCK ")
                     const {orderId }  = req.body ;
                     const user = req.user

                      console.log(" user is  ",user)
                    try {
                        
                        const result = await this._useCase.execute(orderId,user)


                        return this.ok(res,result)
                    } catch (error:any) {
                        
                    }
       }
}