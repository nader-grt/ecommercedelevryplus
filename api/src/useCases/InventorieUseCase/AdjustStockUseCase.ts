import { sequelize } from "../../models/main";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventoryAuditRepo from "../../repo/InventoryAuditRepo/InventoryAuditRepo";
import InventoryAuditDomain from "../../models/domain/InventoryAuditDomain/InventoryAuditDomain";


export default class AdjustStockUseCase {
  constructor(
    private inventorieRepo: InventorieRepo,
    private variantRepo: VariantProductRepo,
    private movementRepo: InventoryMovementRepo,
    private auditRepo: InventoryAuditRepo
  ) {}

  async execute(dto: any) {
    const {
      variantId,
      warehouseId,
      actualQuantity,
      reason,
      userId,
    } = dto;



    console.log("USECASE IS  \t\t ",dto )
    return await sequelize.transaction(async (transaction) => {

      // 1. Check Variant
      const variant = await this.variantRepo.getVariantById(variantId);

      console.log(" variant is \t\t\t\t   \n\n ",variant  , " \n\n\n\n   ### ")
      if (!variant) {
        throw new Error("Variant not found");
      }
      const companyId: number | any =
      variant.product?.companyId;


      console.log("companyId  \t\t\t\t   "  ,companyId  , "\t\t \n ")
    if (!companyId) {
      throw new Error(
        "Product is missing company association"
      );
    }
      // 2. Lock Inventory
      const inventory =
        await this.inventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId,
          companyId,
          transaction
        );

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      // 3. Create Domain
      const audit = new InventoryAuditDomain({
        variantId,
        warehouseId,
        systemQuantity: inventory.quantity,
        actualQuantity,
        reason,
        userId,
      });

      // no difference
      if (audit.difference === 0) {
        return {
          message: "Inventory already correct",
          data: inventory,
        };
      }

      // 4. Save Audit
      await this.auditRepo.create(
        {
          variantId: audit.variantId,
          warehouseId: audit.warehouseId,
          systemQuantity: audit.systemQuantity,
          actualQuantity: audit.actualQuantity,
          difference: audit.difference,
          reason: audit.reason,
          userId: audit.userId,
        },
        transaction
      );

      // 5. Update Inventory
      await this.inventorieRepo.update(
        inventory.id,
        {
          quantity: actualQuantity,
        },
        transaction
      );

      // 6. Save Movement
      await this.movementRepo.create(
        {
          variantId,
          warehouseId,
          quantity: Math.abs(audit.difference),
          type: "ADJUSTMENT",
          note: reason,
          userId,
        },
        transaction
      );

      // 7. Return Updated Inventory
      const updated =
        await this.inventorieRepo.findByVariantAndWarehouse(
          variantId,
          warehouseId,
          companyId,
          transaction
        );

      return {
        message: "Inventory adjusted successfully",
        data: {
          ...updated.toJSON(),
          difference: audit.difference,
        },
      };
    });
  }
}