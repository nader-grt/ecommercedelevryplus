import CategoryDomain from "../../models/domain/cetegoryDomain/categoryDomain";

export default abstract class CategoryRepoInterface {

  protected abstract findByName(name: string): Promise<CategoryDomain | null> ;
  protected abstract categoryHasOrders(categoryId: number): Promise<boolean>;
  protected abstract createCategory(category: {
    name: string;
  }): Promise<CategoryDomain>;

  protected abstract GetCategoryById(
    id: number
  ): Promise<CategoryDomain | any>;

  protected abstract UpdateCategoryById(category: {
    categoryId: number;
    name: string;
  }): Promise<CategoryDomain | null>;

  protected abstract GetAllCategories(
    filterIds?: number[]
  ): Promise<CategoryDomain[]>;

  protected abstract DeleteCategoryById(id: number): Promise<boolean>;
  protected abstract softDeleteCategory(categoryId: number): Promise<void> ;
  protected abstract getOrderItemCountByCategoryId(categoryId: number): Promise<number>
}
