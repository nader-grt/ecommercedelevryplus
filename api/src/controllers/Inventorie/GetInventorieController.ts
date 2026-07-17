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
      const { id } = req.params;
      const { variantId, warehouseId } = req.query;
    
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
    
      } catch (error: any) {
        return this.fail(res, error.message);
      }
    }

    // protected async executeImpl(req: Request, res: Response): Promise<any> {
    //   const { id } = req.params;
    //   const { variantId, warehouseId } = req.query;
    
    //   try {
    //     let result;
    
    //     // =========================
    //     // CASE 1: GET BY ID
    //     // =========================
    //     if (id) {
    //       result = await this._usecase.getById(Number(id));
    //     }
    
    //     // =========================
    //     // CASE 2: GET BY VARIANT
    //     // =========================
    //     else if (variantId && warehouseId) {
    //       result = await this._usecase.getByVariantAndWarehouse(
    //         Number(variantId),
    //         Number(warehouseId)
    //       );
    //     }
    
    //     // =========================
    //     // INVALID REQUEST
    //     // =========================
    //     else {
    //       throw new Error("Provide id OR variantId + warehouseId");
    //     }
    
    //     return this.ok(res, {
    //       message: "Inventory fetched successfully",
    //       data: result,
    //     });
    
    //   } catch (error: any) {
    //     return this.fail(res, error.message);
    //   }
    // }

        // protected async executeImpl(req: Request, res: Response): Promise<any> {
        //     const {id}  = req.params ;
        //     const { variantId, warehouseId } = req.query;

        //     console.log(id        , "*********************     ",{ variantId, warehouseId })
        //           try {
                    
        //             const result = await this._usecase.execute({
        //                 inventoryId: id ? Number(id) : undefined,
        //                 variantId: variantId ? Number(variantId) : undefined,
        //                 warehouseId: warehouseId ? Number(warehouseId) : undefined,
        //               });
                  
        //               return this.ok(res, {
        //                 message: "Inventory fetched successfully",
        //                 data: result,
        //               });
        //           } catch (error:any) {
        //             console.error("GetInventorieController Error:", error);

        //             return this.fail(res, error.message);
        //           }
        // }
}