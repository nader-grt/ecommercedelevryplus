import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import AddStockInventorieUseCase from "../../useCases/InventorieUseCase/AddStockInventorieUseCase";
import { RequestAuth } from "../../middleware/verifyToken";



export default class AddStockInventorieController  extends BaseController
{       
        private _usecase!:AddStockInventorieUseCase
      constructor(usecase :AddStockInventorieUseCase)
      {super()
        this._usecase = usecase ;
      }

     protected async  executeImpl(req: RequestAuth, res: Response): Promise<any> {
               
      console.log("ADDSTCK IN  : ")
        const user = req.user
        const { variantId, warehouseId, quantity } = req.body;

        const dto = {
          variantId,
          warehouseId,
          quantity,
        };
          
               try {
                

                const result = await this._usecase.execute(dto,user)

                console.log("resultttt  is addStockCon,troller "  ,result )
                return this.ok(res, result);


               } catch (error:any) {
                
               }
     }
}