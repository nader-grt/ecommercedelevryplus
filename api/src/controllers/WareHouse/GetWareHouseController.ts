import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetWareHouseUseCase from "../../useCases/WareHouseUseCase/GetWareHouseUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class GetWareHouseController extends BaseController {
  private _usecase: GetWareHouseUseCase;

  constructor(usecase: GetWareHouseUseCase) {
    super();
    this._usecase = usecase;
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {
      //  1. Extract params
      const id = Number(req.params.id);
      const user = req.user;

      // 2. Validation (important)
      if (!id || isNaN(id)) {

        return this.fail(res,"Invalid warehouse id")
     
      }

      if (!user) {

        return this.unauthorized(res,"Unauthorized")
    
      }

      //  3. Call UseCase
      const warehouse = await this._usecase.execute(id, user);

      // 4. Not found handling
      if (!warehouse) {

        return this.notFound(res,"Warehouse not found")
      
      }

      //  5. Success response (React-Admin friendly)
      return this.resultValue(res," warehouse with success ",warehouse)
     

    } catch (error: any) {
      const message = error.message || "Internal server error";

      // map known errors
      if (message === "Invalid warehouse id") {
        return this.fail(res,message)
      }

      if (
        message === "Unauthorized" ||
        message === "Unauthorized role"
      ) {
        return res.status(401).json({ success: false, message });
      }

      if (message === "Warehouse not found") {
        return res.status(404).json({ success: false, message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}