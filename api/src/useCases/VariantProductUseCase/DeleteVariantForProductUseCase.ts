import sequelize from "../../dbConfig/config";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class DeleteVariantForProductUseCase {
  private _repo: VariantProductRepo;

  constructor(repo: VariantProductRepo) {
    this._repo = repo;
  }

  async execute(id: number): Promise<any> {
    const t = await sequelize.transaction();
  
    try {
      if (!id) throw new Error("Variant id is required");
  
      // =========================
      // 1. GET VARIANT
      // =========================
      const variant = await this._repo.getVariantById(id);
  
      if (!variant) {
        throw new Error("Variant not found");
      }
  
      const productId = variant.productId;
  
      // =========================
      // 2. CHECK ORDERS
      // =========================
      const orderCount = await this._repo.countOrders(id, t);
  
      if (orderCount > 0) {
        throw new Error("Cannot delete variant used in orders");
      }
  
      // =========================
      // 3. CHECK INVENTORY
      // =========================
      const inventoryCount = await this._repo.countInventory(id, t);
  
      // =========================
      // 4. SOFT DELETE
      // =========================
      await this._repo.softDeleteVariant(id, t);
  
      // =========================
      // 5. HANDLE INVENTORY
      // =========================
      let message = "Variant deleted";
  
      if (inventoryCount > 0) {
        message = "Variant archived (inventory exists)";
      }
  
      // =========================
      // 6. CHECK REMAINING VARIANTS
      // =========================
      const remaining = await this._repo.countByProduct(productId);
  
      if (remaining === 0) {
        await this._repo.convertProductToSimple(productId);
      }
  
      await t.commit();
  
      return {
        success: true,
        message,
      };
  
    } catch (error: any) {
      await t.rollback();
      console.error("USECASE ERROR:", error);
      throw error;
    }
  }
}