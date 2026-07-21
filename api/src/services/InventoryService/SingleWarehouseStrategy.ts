import { Transaction } from "sequelize";
import { IWarehouseAllocator, AllocationRequest, Allocation } from "./IWarehouseAllocator";
import IInventoryRepository from "../../repo/InventorieRepo/InventorieRepo";

// ===================================================
// SINGLE WAREHOUSE STRATEGY
// استراتيجية المستودع الواحد
// ===================================================

/**
 * ما هي؟
 * تبحث عن مستودع واحد يمكنه تلبية كل العناصر في الطلب
 * 
 * لماذا؟
 * - أقل تكلفة شحن (شحنة واحدة)
 * - أسرع في التجهيز
 * - أقل تعقيد في التتبع
 * 
 * كيف؟
 * 1. جلب كل المستودعات
 * 2. لكل مستودع: هل يكفي كل العناصر؟
 * 3. أول مستودع يكفي ← نختاره
 */

export class SingleWarehouseStrategy implements IWarehouseAllocator {

    constructor(
        private readonly inventoryRepo: IInventoryRepository
    ) {}

    async allocate(request: AllocationRequest): Promise<Allocation[]> {
        
        // ── جلب المستودعات من المخزون (unique warehouseIds) ──
        const warehouseIds = await this.inventoryRepo.findWarehouseIdsByCompany(
            request.companyId,
            request.transaction
        );

        // ── فحص كل مستودع ──
        for (const warehouseId of warehouseIds) {
            
            const canFulfill = await this.canFulfillAll(
                warehouseId,
                request.companyId,
                request.items,
                request.transaction
            );

            if (canFulfill) {
                // ✅ وجدنا مستودعاً يكفي
                return request.items.map(item => ({
                    orderItemId: item.orderItemId,
                    warehouseId,
                    variantId: item.variantId,
                    quantity: item.quantity
                }));
            }
        }

        // ❌ لا يوجد مستودع واحد يكفي
        return [];
    }
//OrderItemInput
private async canFulfillAll(
    warehouseId: number,
    companyId: number,
    items: any[],
    transaction: Transaction
): Promise<boolean> {

    for (const item of items) {
        const inventory = await this.inventoryRepo.findForUpdate(
            item.variantId,
            warehouseId,
            companyId,
            transaction
        );

        if (!inventory) {
            return false;
        }

        const available = inventory.quantity - inventory.reserved;

        if (available < item.quantity) {
            return false;
        }
    }

    return true;
}
}