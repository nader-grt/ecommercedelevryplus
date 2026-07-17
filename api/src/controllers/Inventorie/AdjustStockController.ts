import { Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import AdjustStockUseCase from "../../useCases/InventorieUseCase/AdjustStockUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class AdjustStockController extends BaseController {
  private _useCase: AdjustStockUseCase;

  constructor(useCase: AdjustStockUseCase) {
    super();
    this._useCase = useCase;
  }

  protected async executeImpl(
    req: RequestAuth,
    res: Response
  ): Promise<any> {
    console.log("Adjust Stock");

    try {
      const user = req.user;

      const {
        variantId,
        warehouseId,
        actualQuantity,
        reason,
      } = req.body;

      const result = await this._useCase.execute({
        variantId,
        warehouseId,
        actualQuantity,
        reason,
        userId: user?.id,
      });

      return this.ok(res, result);
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}