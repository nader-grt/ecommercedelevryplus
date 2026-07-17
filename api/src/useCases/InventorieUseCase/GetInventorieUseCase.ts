import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class GetInventorieUseCase {
  private _variantProductRepo: VariantProductRepo;
  private _InventorieRepo: InventorieRepo;

  constructor(
    inventorieRepo: InventorieRepo,
    variantProductRepo: VariantProductRepo
  ) {
    this._InventorieRepo = inventorieRepo;
    this._variantProductRepo = variantProductRepo;
  }

  async execute(dto: {
    inventoryId?: number;
    variantId?: number;
    warehouseId?: number;
  }): Promise<any> {
    const { inventoryId, variantId, warehouseId } = dto;

    // =========================
    // CASE 1: GET BY ID
    // =========================
    if (inventoryId) {
      const inventory = await this._InventorieRepo.findById(inventoryId);

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      return {
        ...inventory.toJSON(),
        available: inventory.quantity - inventory.reserved,
      };
    }

    // =========================
    // CASE 2: GET BY VARIANT + WAREHOUSE
    // =========================
    if (variantId && warehouseId) {
      const variant = await this._variantProductRepo.getVariantById(variantId);
      if (!variant) {
        throw new Error("Variant not found");
      }

      const inventory =
        await this._InventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId
        );

      if (!inventory) {
        throw new Error("Inventory not found for this variant & warehouse");
      }

      return {
        ...inventory.toJSON(),
        available: inventory.quantity - inventory.reserved,
      };
    }

    // =========================
    // INVALID REQUEST
    // =========================
    throw new Error("Provide inventoryId OR variantId + warehouseId");
  }
}