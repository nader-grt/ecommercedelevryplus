import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateInventorieUseCase from "../../useCases/InventorieUseCase/CreateInventorieUseCase";
import { RequestAuth } from "../../middleware/verifyToken";



export default class CreateInventorieController extends BaseController
{

 private _usecase !: CreateInventorieUseCase
    constructor(usecase : CreateInventorieUseCase)
    {super()
      this._usecase  = usecase
    }
      protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
                       try {
                        
              const user = req.user
                        const { variantId, warehouseId, quantity } = req.body;

                        const dto = {
                          variantId,
                          warehouseId,
                          quantity,
                        };
                  
                        const result = await this._usecase.execute(dto,user);
                  
                        return this.ok(res, result);
                       
                       } catch (error) {
                        
                       }
      }
}