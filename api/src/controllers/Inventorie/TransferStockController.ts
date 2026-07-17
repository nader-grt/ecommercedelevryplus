import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import TransferStockUseCase from "../../useCases/InventorieUseCase/TransferStockUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class TransferStockController extends BaseController {
  private _useCase!: TransferStockUseCase;
  constructor(useCase: TransferStockUseCase) {
    super();

    this._useCase = useCase;
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    const user = req.user;
    const { variantId, fromWarehouseId, toWarehouseId, quantity } = req.body;
    /**
                 {
"variantId":8,
"fromWarehouseId":1,
"toWarehouseId":2,
"quantity":100
}
                 */
                console.log("Transfer  Stock \n is  :  ")



    try {



        const result = await this._useCase.execute({

            variantId,
    
            fromWarehouseId,
    
            toWarehouseId,
    
            quantity,
    
            userId: user?.id
    
          });
    
    
    
          return this.ok(
            res,
            result
          );
    
    } catch (error: any) {
        console.error(
            "TransferStockController ERROR",
            error
          );
    
    
          return this.fail(
            res,
            error.message
          );

    }
  }
}
