import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ReserveStockUseCase, { ReserveStockCommand } from "../../useCases/InventorieUseCase/ReserveStockUseCase";
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
                        
               

                     const command = this.buildCommand(req);

                     console.log("command is \t ",command)
                     
                     const result = await this._useCase.execute(command);
         
                    
                     return this.ok(res, result);
         
                    } catch (error:any) {
                        
                    }
       }
       private buildCommand(req: RequestAuth): ReserveStockCommand {
        
              const { orderId } = req.body;
              const user :any = req.user;
      
              //   orderId
              if (!orderId || typeof orderId !== 'number') {
                  throw new Error("ORDER_ID_REQUIRED: معرف الطلب مطلوب ويجب أن يكون رقماً");
              }
      
              return {
                  orderId: orderId,
                  userId: user.id,
                  companyId: 29
              };
          }
}