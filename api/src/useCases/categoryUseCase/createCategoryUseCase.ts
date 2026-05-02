import CategoryDomain from "../../models/domain/cetegoryDomain/categoryDomain";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";

export default class CreateCategoryUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  async execute(name: string): Promise<CategoryDomain> {
    try {
      // ======================
      // 1. VALIDATION (DOMAIN LEVEL)
      // ======================
      const categoryDomain = new CategoryDomain();
      categoryDomain.setName = name;

      categoryDomain.validateName();

      // ======================
      // 2. SAVE TO DB
      // ======================
      const createdCategory = await this.categoryRepo.createCategory({
        name: categoryDomain.getName,
      });

      console.log("controllerrrrrrr  ",createdCategory)

      return createdCategory;

    } catch (error: any) {
      console.log("CreateCategoryUseCase error:", error);
      throw new Error(error.message || "create category failed");
    }
  }
}