import StockTransferDomain from "../../models/domain/StockTransferDomain/StockTransferDomain";
import { sequelize } from "../../models/main";

import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import WareHouseRepo from "../../repo/WareHouseRepo/WareHouseRepo";


export default class TransferStockUseCase {
  constructor(
    private inventoryRepo: InventorieRepo,

    private variantRepo: VariantProductRepo,

    private warehouseRepo: WareHouseRepo,

    private movementRepo: InventoryMovementRepo
  ) {}

  async execute(dto: any,user?: any) {
    return await sequelize.transaction(async (transaction) => {
      const transfer = new StockTransferDomain({
        variantId: dto.variantId,

        fromWarehouseId: dto.fromWarehouseId,

        toWarehouseId: dto.toWarehouseId,

        quantity: dto.quantity,
      });

      // 1. Check Variant

      const variant = await this.variantRepo.getVariantById(transfer.variantId);

      if (!variant) {
        throw new Error("Variant not found");
      }

      const companyId = variant.product?.companyId; // variant.companyId
if (!companyId) throw new Error("Product is missing company association");


console.log("companyIDD IS  "  , companyId)
      // 2. Check Source Warehouse

      const sourceWarehouse = await this.warehouseRepo.findById(
        transfer.fromWarehouseId
      );

      if (!sourceWarehouse) {
        throw new Error("Source warehouse not found");
      }

      // 3. Check Destination Warehouse

      const destinationWarehouse = await this.warehouseRepo.findById(
        transfer.toWarehouseId
      );

      if (!destinationWarehouse) {
        throw new Error("Destination warehouse not found");
      }

      // 4. Get source inventory with lock

      const sourceInventory =
        await this.inventoryRepo.findByVariantAndWarehouse(
          transfer.variantId,

          transfer.fromWarehouseId,

          transaction
        );

      if (!sourceInventory) {
        throw new Error("Source inventory not found");
      }

      const available = sourceInventory.quantity - sourceInventory.reserved;

      // 5. Business rule

      if (!transfer.canTransfer(available)) {
        throw new Error("Insufficient stock");
      }

      // 6. Decrease Source

      await this.inventoryRepo.update(
        sourceInventory.id,

        {
          quantity: sourceInventory.quantity - transfer.quantity,
        },

        transaction
      );

      // 7. Increase Destination

      const destinationInventory =
        await this.inventoryRepo.findByVariantAndWarehouse(
          transfer.variantId,

          transfer.toWarehouseId,

          transaction
        );

      if (destinationInventory) {
        await this.inventoryRepo.update(
          destinationInventory.id,

          {
            quantity: destinationInventory.quantity + transfer.quantity,
          },

          transaction
        );
      } else {
        // await this.inventoryRepo.create(
        //   {
        //     variantId: transfer.variantId,

        //     warehouseId: transfer.toWarehouseId,

        //     quantity: transfer.quantity,

        //     reserved: 0,
        //   },

        //   transaction
        // );


        await this.inventoryRepo.create(
          {
              variantId: transfer.variantId,
              warehouseId: transfer.toWarehouseId,
              companyId,
              quantity: transfer.quantity,
              reserved: 0,
          },
          transaction
          );


      }

      // 8. Movement OUT

      await this.movementRepo.create(
        {
          variantId: transfer.variantId,

          warehouseId: transfer.fromWarehouseId,

          type: "OUT",

          quantity: transfer.quantity,

          note: `Transfer to warehouse ${transfer.toWarehouseId}`,
        },

        transaction
      );

      // 9. Movement IN

      await this.movementRepo.create(
        {
          variantId: transfer.variantId,

          warehouseId: transfer.toWarehouseId,

          type: "IN",

          quantity: transfer.quantity,

          note: `Transfer from warehouse ${transfer.fromWarehouseId}`,
        },

        transaction
      );

      return {
        message: "Stock transferred successfully",

        data: {
          variantId: transfer.variantId,

          fromWarehouseId: transfer.fromWarehouseId,

          toWarehouseId: transfer.toWarehouseId,

          quantity: transfer.quantity,
        },
      };
    });
  }
}

// import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
// import { InventoryPolicy } from "../../Policy/InventoryPolicy";

// export class TransferStockUseCase {
//     constructor(
//       private inventoryRepo: any,
//       private movementRepo: any
//     ) {}

//     async execute(dto: any, user: any, transaction: any) {
//       const source = await this.inventoryRepo.findById(dto.sourceInventoryId, transaction);
//       const target = await this.inventoryRepo.findById(dto.targetInventoryId, transaction);

//       InventoryPolicy.canAccess(user, source.companyId);

//       const sourceDomain = new InventorieDomain(source);
//       const targetDomain = new InventorieDomain(target);

//       sourceDomain.transferTo(target.warehouseId, dto.quantity, user.id);
//       targetDomain.addStock(dto.quantity, user.id);

//       await this.inventoryRepo.update(sourceDomain.id, {
//         quantity: sourceDomain.quantity,
//         reserved: sourceDomain.reserved,
//       }, transaction);

//       await this.inventoryRepo.update(targetDomain.id, {
//         quantity: targetDomain.quantity,
//         reserved: targetDomain.reserved,
//       }, transaction);

//       await this.movementRepo.bulkCreate([
//         ...sourceDomain.pullMovements().map((m: any) => m.toJSON()),
//         ...targetDomain.pullMovements().map((m: any) => m.toJSON()),
//       ], transaction);

//       return { message: "Transfer done" };
//     }
//   }
