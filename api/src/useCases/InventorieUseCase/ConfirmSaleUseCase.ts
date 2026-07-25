import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
import { InventoryPolicy } from "../../Policy/InventoryPolicy";
import InventorieRepo from '../../repo/InventorieRepo/InventorieRepo';
import InventoryMovementRepo from '../../repo/MovementRepo/InventoryMovementRepo';

export class ConfirmSaleUseCase {
  constructor(
    private _InventorieRepo: InventorieRepo,
    private  _InventoryMovementRepo: InventoryMovementRepo
) {}
  
    async execute(dto: any, user: any, transaction: any) {
      const inventory = await this._InventorieRepo.findById(dto.inventoryId, transaction);
  
      InventoryPolicy.canAccess(user, inventory.companyId);
  
      //  استخدم toState() أو مرر الخصائص مباشرة
      const domain = new InventorieDomain({
        id: inventory.id,
        companyId: inventory.companyId,
        variantId: inventory.variantId,
        warehouseId: inventory.warehouseId,
        quantity: Number(inventory.quantity),
        reserved: Number(inventory.reserved)
      });
  
      // غيّر من confirmSale → commit
      domain.commit(dto.quantity, user.id);
  
      await this._InventorieRepo.update(domain.id, {
        quantity: domain.quantity,
        reserved: domain.reserved,
      }, transaction);
  
      await this._InventoryMovementRepo.bulkCreate(
        domain.pullMovements().map((m: any) => m.toJSON()),
        transaction
      );
  
      return domain.toJSON();
    }
}