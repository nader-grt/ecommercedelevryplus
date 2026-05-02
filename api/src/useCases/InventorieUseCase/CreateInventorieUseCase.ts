import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventorieDomain from '../../models/domain/InventorieDomain/InventorieDomain';
import { InventoryPolicy } from "../../Policy/InventoryPolicy";

export default class CreateInventorieUseCase {
  private _variantProductRepo!: VariantProductRepo;
  private _InventorieRepo!: InventorieRepo;
  private  _inventoryMovement!: InventoryMovementRepo
  constructor(
    inventorieRepo: InventorieRepo,
    variantProductRepo: VariantProductRepo,
    inventoryMovement:InventoryMovementRepo
  ) {
    this._InventorieRepo = inventorieRepo;
    this._variantProductRepo = variantProductRepo;
    this._inventoryMovement = inventoryMovement
  }

  async execute(dto: any, user: any, transaction?: any) {
    const { variantId, warehouseId, quantity } = dto;

    // ================================
    // 1. VALIDATION
    // ================================
    if (quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    const variant = await this._variantProductRepo.getVariantById(variantId);
    if (!variant) throw new Error("Variant not found");

    try {
      // ================================
      // 2. TRY GET INVENTORY WITH LOCK
      // ================================
      let inventory =
        await this._InventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId,
          transaction
        );

      // ================================
      // 3. CREATE CASE
      // ================================
      if (!inventory) {
        const created = await this._InventorieRepo.create(
          {
            variantId,
            warehouseId,
            companyId: variant.companyId,
            quantity: 0,
            reserved: 0,
          },
          transaction
        );

        inventory = created;
      }

      // ================================
      // 4. POLICY CHECK
      // ================================
      InventoryPolicy.canAccess(user, inventory.companyId);

      // ================================
      // 5. DOMAIN LOGIC
      // ================================
      const domain = new InventorieDomain(inventory);

      domain.addStock(quantity, user.id);

      // ================================
      // 6. SAVE INVENTORY
      // ================================
      await this._InventorieRepo.update(
        domain.id,
        {
          quantity: domain.quantity,
          reserved: domain.reserved,
        },
        transaction
      );

      // ================================
      // 7. SAVE MOVEMENTS
      // ================================
      await this._inventoryMovement.bulkCreate(
        domain.pullMovements().map((m: any) => m.toJSON()),
        transaction
      );

      return {
        message: "Stock updated successfully",
        data: domain.toJSON(),
      };
    } catch (error: any) {
      // ================================
      // 8. HANDLE RACE CONDITION
      // ================================
      if (error.name === "SequelizeUniqueConstraintError") {
        const inventory =
          await this._InventorieRepo.findByVariantAndWarehouse(
            variantId,
            warehouseId,
            transaction
          );

        InventoryPolicy.canAccess(user, inventory.companyId);

        const domain = new InventorieDomain(inventory);

        domain.addStock(quantity, user.id);

        await this._InventorieRepo.update(
          domain.id,
          {
            quantity: domain.quantity,
            reserved: domain.reserved,
          },
          transaction
        );

        await this._inventoryMovement.bulkCreate(
          domain.pullMovements().map((m: any) => m.toJSON()),
          transaction
        );

        return {
          message: "Stock updated after race condition",
          data: domain.toJSON(),
        };
      }

      throw error;
    }
  }

}

/**
   async execute(dto: any): Promise<any> {
    const { variantId, warehouseId, quantity } = dto;

        // 1. check variant exists
        const variant = await this._variantProductRepo.getVariantById(variantId);
    try {
  
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
        //  increment safely inside transaction
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
        //data: newInventory,
        data: {
          ...newInventory.toJSON(),
          variant: {
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            product: variant.product, //  
          },
        },
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
         // data: updated,
         data: {
          ...updated,
          variant: variant, // includes product
        },
        };
      }

      throw error;
    }
  }
 */