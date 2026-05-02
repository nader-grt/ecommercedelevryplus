import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
import { InventoryPolicy } from "../../Policy/InventoryPolicy";

export class ReserveStockUseCase {
    constructor(private inventoryRepo: any, private movementRepo: any) {}
  
    async execute(dto: any, user: any, transaction: any) {
      const inventory = await this.inventoryRepo.findById(dto.inventoryId, transaction);
  
      if (!inventory) throw new Error("Inventory not found");
  
      InventoryPolicy.canAccess(user, inventory.companyId);
  
      const domain = new InventorieDomain(inventory);
  
      domain.reserveStock(dto.quantity, user.id);
  
      await this.inventoryRepo.update(domain.id, {
        quantity: domain.quantity,
        reserved: domain.reserved,
      }, transaction);
  
      await this.movementRepo.bulkCreate(
        domain.pullMovements().map((m: any) => m.toJSON()),
        transaction
      );
  
      return domain.toJSON();
    }
  }