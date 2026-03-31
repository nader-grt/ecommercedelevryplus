import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetInventorieUseCase from "../../useCases/InventorieUseCase/GetInventorieUseCase";



export default class GetInventorieController extends BaseController
{

    private _usecase !: GetInventorieUseCase
    constructor(usecase : GetInventorieUseCase)
    {super()
      this._usecase  = usecase
    }

        protected async executeImpl(req: Request, res: Response): Promise<any> {
            const {id}  = req.params ;
            const { variantId, warehouseId } = req.query;

            console.log(id        , "*********************     ",{ variantId, warehouseId })
                  try {
                    
                    const result = await this._usecase.execute({
                        inventoryId: id ? Number(id) : undefined,
                        variantId: variantId ? Number(variantId) : undefined,
                        warehouseId: warehouseId ? Number(warehouseId) : undefined,
                      });
                  
                      return this.ok(res, {
                        message: "Inventory fetched successfully",
                        data: result,
                      });
                  } catch (error:any) {
                    console.error("GetInventorieController Error:", error);

                    return this.fail(res, error.message);
                  }
        }
}