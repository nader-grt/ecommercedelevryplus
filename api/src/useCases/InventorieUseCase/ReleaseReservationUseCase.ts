import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
import { InventoryPolicy } from "../../Policy/InventoryPolicy";

export class ReleaseReservationUseCase {
    constructor(
        private inventoryRepo: any,
        private movementRepo: any
    ) {}

    async execute(dto: any, user: any, transaction: any) {
        // 1. Load inventory with lock
        const inventory = await this.inventoryRepo.findById(dto.inventoryId, transaction);

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
        await this.inventoryRepo.update(
            domain.id,
            {
                quantity: domain.quantity,
                reserved: domain.reserved,
            },
            transaction
        );

        // 6. Record movements
        await this.movementRepo.bulkCreate(
            domain.pullMovements().map((m: any) => m.toJSON()),
            transaction
        );

        return domain.toJSON();
    }
}