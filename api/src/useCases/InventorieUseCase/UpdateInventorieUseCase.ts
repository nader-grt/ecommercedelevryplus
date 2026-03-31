import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class UpdateInventorieUseCase {
  private _variantProductRepo!: VariantProductRepo;
  private _InventorieRepo!: InventorieRepo;
  constructor(
    inventorieRepo: InventorieRepo,
    variantProductRepo: VariantProductRepo
  ) {
    this._InventorieRepo = inventorieRepo;
    this._variantProductRepo = variantProductRepo;
  }
  async execute(dto: any): Promise<any> {
    const { variantId, warehouseId, quantity } = dto;
    try {
      // 1. check variant exists
      const variant = await this._variantProductRepo.getVariantById(variantId);
      if (!variant) {
        throw new Error("Variant not found");
      }

      const existingInventory =
        await this._InventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId
        );

      // ================================
      // CASE 1: INVENTORY EXISTS
      // ================================
      if (existingInventory) {
        // 🔒 increment safely inside transaction
        await this._InventorieRepo.incrementStock(
          existingInventory.id,
          quantity
        );

        const updated = await this._InventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId
        );

        return {
          message: "Stock updated successfully",
          data: updated,
        };
      }

      const newInventory = await this._InventorieRepo.createInventorie({
        variantId,
        warehouseId,
        quantity,
        reserved: 0,
      });

      return {
        message: "Stock created successfully",
        data: newInventory,
      };
    } catch (error: any) {
      // HANDLE RACE CONDITION (duplicate insert)
      if (error.name === "SequelizeUniqueConstraintError") {
        // another request already created it → fallback to increment

        const inventory = await this._InventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId
        );

        await this._InventorieRepo.incrementStock(inventory.id, quantity);

        const updated = await this._InventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId
        );

        return {
          message: "Stock updated after race condition",
          data: updated,
        };
      }

      throw error;
    }
  }
}
