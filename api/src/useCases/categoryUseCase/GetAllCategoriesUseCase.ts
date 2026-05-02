import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import CategoryDomain from "../../models/domain/cetegoryDomain/categoryDomain";

export default class GetAllCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepo) {}

  async execute(filterIds?: number[]): Promise<CategoryDomain[]> {
    try {
      return await this.categoryRepo.GetAllCategories(filterIds);
    } catch (error) {
      console.log("UseCase error:", error);
      throw error;
    }
  }
}
