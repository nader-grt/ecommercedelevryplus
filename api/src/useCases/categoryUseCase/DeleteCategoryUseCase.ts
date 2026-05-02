import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import ProductRepo from "../../repo/productRepo/productRepo";

export type DeleteCategoryResult =
  | { status: "NOT_FOUND"; message: string,count:number }
  | { status: "HAS_ORDERS"; message: string,count:number }
  | { status: "HAS_PRODUCTS"; message: string,count:number }
  | { status: "DELETED"; message: string,count:number }
  | { status: "ERROR"; message: string,count:number };

export default class DeleteCategoryUseCase {
  private usecaseRepo: CategoryRepo;
  private productRepo: ProductRepo;

  constructor(categoryRepo: CategoryRepo, productRepo: ProductRepo) {
    this.usecaseRepo = categoryRepo;
    this.productRepo = productRepo;
  }

  async execute(id: number): Promise<DeleteCategoryResult> {
    try {
      // =========================
      // 1. CHECK CATEGORY EXISTS
      // =========================
      const category = await this.usecaseRepo.GetCategoryById(id);
  
      if (!category) {
        return {
          status: "NOT_FOUND",
          message: "Category not found",
          count: 0,
        };
      }
  
      // =========================
      // 2. CHECK ORDERS
      // =========================
      const orderCount = await this.usecaseRepo.getOrderItemCountByCategoryId(id);
  
      if (orderCount > 0) {
        return {
          status: "HAS_ORDERS",
          message: "Category is linked to orders",
          count: orderCount,
        };
      }
  
      // =========================
      // 3. CHECK PRODUCTS
      // =========================
      const productCount =
        await this.productRepo.getProductCountByCategoryId(id);
  
      if (productCount > 0) {
        return {
          status: "HAS_PRODUCTS",
          message: "Category has products",
          count: productCount,
        };
      }
  
      // =========================
      // 4. DELETE
      // =========================
      await this.usecaseRepo.softDeleteCategory(id);
  
      return {
        status: "DELETED",
        message: "Category deleted successfully",
        count: 0,
      };
    } catch (error) {
      console.log("DeleteCategoryUseCase error:", error);
  
      return {
        status: "ERROR",
        message: "Internal server error",
        count: 0,
      };
    }
  }
}