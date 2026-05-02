import { BaseController } from "../../infra/BaseCOntroller";
import { Request, Response } from "express";
import CreateCategoryUseCase from "../../useCases/categoryUseCase/createCategoryUseCase";

export default class CreateCategoryController extends BaseController {
  private usecase: CreateCategoryUseCase;

  constructor(createCategoryUseCase: CreateCategoryUseCase) {
    super();
    this.usecase = createCategoryUseCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.body;

      // ======================
      // 1. VALIDATION
      // ======================
      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return this.conflict(res, "Invalid category name");
      }

      // ======================
      // 2. USE CASE CALL
      // ======================

      console.log("nameeeeeeeeeeee  ",name)
      const result = await this.usecase.execute(name.trim());

      if (!result) {
        return this.fail(res, "Category creation failed");
      }

      // ======================
      // 3. RESPONSE
      // ======================
      // return this.resultValue(res, "category created successfully", 
      //   result.getToResponseCategory(),
      // );

      const category = result.getToResponseCategory();

      console.log("object  ",{data: {
        id: category.categoryId,  //  
        name: category.name,
      },})
return this.resultValue(res, "category created successfully", {
  data: {
    id: category.categoryId,  //  
    name: category.name,
  },
});
    } catch (error: any) {
      
      return this.fail(res, "server error");
    }
  }
}