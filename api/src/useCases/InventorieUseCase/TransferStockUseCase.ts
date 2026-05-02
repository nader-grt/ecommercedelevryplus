import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
import { InventoryPolicy } from "../../Policy/InventoryPolicy";

export class TransferStockUseCase {
    constructor(
      private inventoryRepo: any,
      private movementRepo: any
    ) {}
  
    async execute(dto: any, user: any, transaction: any) {
      const source = await this.inventoryRepo.findById(dto.sourceInventoryId, transaction);
      const target = await this.inventoryRepo.findById(dto.targetInventoryId, transaction);
  
      InventoryPolicy.canAccess(user, source.companyId);
  
      const sourceDomain = new InventorieDomain(source);
      const targetDomain = new InventorieDomain(target);
  
      sourceDomain.transferTo(target.warehouseId, dto.quantity, user.id);
      targetDomain.addStock(dto.quantity, user.id);
  
      await this.inventoryRepo.update(sourceDomain.id, {
        quantity: sourceDomain.quantity,
        reserved: sourceDomain.reserved,
      }, transaction);
  
      await this.inventoryRepo.update(targetDomain.id, {
        quantity: targetDomain.quantity,
        reserved: targetDomain.reserved,
      }, transaction);
  
      await this.movementRepo.bulkCreate([
        ...sourceDomain.pullMovements().map((m: any) => m.toJSON()),
        ...targetDomain.pullMovements().map((m: any) => m.toJSON()),
      ], transaction);
  
      return { message: "Transfer done" };
    }
  }