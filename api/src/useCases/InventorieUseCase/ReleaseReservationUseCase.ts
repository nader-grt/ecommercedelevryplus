import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
import { InventoryPolicy } from "../../Policy/InventoryPolicy";
import InventorieRepo from '../../repo/InventorieRepo/InventorieRepo';
import InventoryMovementRepo from '../../repo/MovementRepo/InventoryMovementRepo';

export class ReleaseReservationUseCase {
    constructor(
        private InventorieRepo: any,
        private InventoryMovementRepo: any
    ) {}

    async execute(dto: any, user: any, transaction: any) {
        // 1. Load inventory with lock
        const inventory = await this.InventorieRepo.findById(dto.inventoryId, transaction);

        // 2. Authorization check
        InventoryPolicy.canAccess(user, inventory.companyId);

        // 3. Create domain instance
        const domain = new InventorieDomain({
            id: inventory.id,
            companyId: inventory.companyId,
            variantId: inventory.variantId,
            warehouseId: inventory.warehouseId,
            quantity: Number(inventory.quantity),
            reserved: Number(inventory.reserved)
        });

        // 4. Release reserved stock  ← FIXED: releaseReserved → release
        domain.release(dto.quantity, user.id);

        // 5. Save updated state
        await this.InventorieRepo.update(
            domain.id,
            {
                quantity: domain.quantity,
                reserved: domain.reserved,
            },
            transaction
        );

        // 6. Record movements
        await this.InventoryMovementRepo.bulkCreate(
            domain.pullMovements().map((m: any) => m.toJSON()),
            transaction
        );

        return domain.toJSON();
    }
}