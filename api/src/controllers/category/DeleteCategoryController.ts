import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import DeleteCategoryUseCase from "../../useCases/categoryUseCase/DeleteCategoryUseCase";

export default class DeleteCategoryController extends BaseController {
  constructor(private usecase: DeleteCategoryUseCase) {
    super();
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    const id = Number(req.params.id);

    console.log("DELETE CATEGORY ID:", id);

    if (isNaN(id)) {
      return this.resultValue(
        res,
        "Invalid category id",
        null,
        "ERROR"
      );
    }

    try {
      const result = await this.usecase.execute(id);

      switch (result.status) {
        // =========================
        case "NOT_FOUND":
          return this.resultValue(
            res,
            result.message,
            null,
            result.status
          );

        // =========================
        case "HAS_ORDERS":
          return this.resultValue(
            res,
            result.message,
            {
                  count: result.count,
                },
            result.status
          );

        // =========================
        case "HAS_PRODUCTS":
          return this.resultValue(
            res,
            result.message,
            {
              count: result.count,
            },
            result.status
          );

        // =========================
        case "DELETED":
          return this.resultValue(
            res,
            result.message,
            {
              id,
            },
            result.status
          );

        // =========================
        case "ERROR":
          return this.resultValue(
            res,
            result.message,
            null,
            result.status
          );

        // =========================
        default: {
          const _exhaustive: never = result;

          return this.resultValue(
            res,
            "Unhandled case",
            null,
            "ERROR"
          );
        }
      }
    } catch (err) {
      console.log("Controller error:", err);

      return this.resultValue(
        res,
        "Internal server error",
        null,
        "ERROR"
      );
    }
  }
}