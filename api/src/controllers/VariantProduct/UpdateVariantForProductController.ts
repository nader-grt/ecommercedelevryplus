import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateVariantForProductUseCase from "../../useCases/VariantProductUseCase/UpdateVariantForProductUseCase";

export default class UpdateVariantForProductController extends BaseController {
  private _usecase: UpdateVariantForProductUseCase;

  constructor(usecase: UpdateVariantForProductUseCase) {
    super();
    this._usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const data = {
        id: Number(req.params.id),
        ...req.body,
      };

      // ===============================
      // LOG (DEV ONLY)
      // ===============================
      console.log("🔥 UPDATE VARIANT REQUEST:", data);

      const result = await this._usecase.execute(data);

      return this.ok(res, {
        success: true,
        message: "Variant updated successfully",
        data: result,
      });
    } catch (error: any) {
      return this.fail(res, "error failed"
      );
    }
  }
}