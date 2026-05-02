import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetAllCategoriesUseCase from "../../useCases/categoryUseCase/GetAllCategoriesUseCase";

export default class GetAllCategoriesController extends BaseController {

  constructor(private usecase: GetAllCategoriesUseCase) {
    super();
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {

      const { ids } = req.query;

      // =========================
      // SAFE PARSING
      // =========================
      let filterIds: number[] | undefined;

      if (typeof ids === "string") {
        filterIds = ids
          .split(",")
          .map(id => Number(id))
          .filter(id => !isNaN(id) && id > 0);
      }

      // =========================
      // USECASE CALL
      // =========================
      const categories = await this.usecase.execute(filterIds);

      // =========================
      // EMPTY CHECK
      // =========================
      if (!categories || categories.length === 0) {
        return this.notFound(res, "No categories found");
      }

      // =========================
      // RESPONSE FORMAT
      // =========================
      const formatted = categories.map(cat => ({
        id: cat.getCategoryId,
        name: cat.getName,
      }));

      return this.resultValue(
        res,
        "Categories fetched successfully",
        {
          data: formatted,
          total: formatted.length,
        }
      );

    } catch (error) {
      console.log("Controller error:", error);

      return this.fail(res, "Internal server error");
    }
  }
}