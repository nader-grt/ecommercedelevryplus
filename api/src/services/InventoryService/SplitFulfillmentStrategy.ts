import { IWarehouseAllocator, AllocationRequest, Allocation } from "./IWarehouseAllocator";

// ── Repositories ──
import IWarehouseRepository from "../../repo/WareHouseRepo/WareHouseRepo";
import IInventoryRepository from "../../repo/InventorieRepo/InventorieRepo";

// ===================================================
// SPLIT FULFILLMENT STRATEGY
// استراتيجية التنفيذ المقسم
// ===================================================

/**
 * تقسم الطلب بين عدة مستودعات لتحقيق التلبية الكاملة.
 *
 * الآلية:
 * 1. جلب جميع مستودعات الشركة.
 * 2. المرور على كل مستودع.
 * 3. لكل عنصر في الطلب، تخصيص أكبر كمية ممكنة.
 * 4. إذا لم تكتمل جميع العناصر يتم إرجاع خطأ.
 */
export class SplitFulfillmentStrategy implements IWarehouseAllocator {

    constructor(
        private readonly warehouseRepo: IWarehouseRepository,
        private readonly inventoryRepo: IInventoryRepository
    ) {}

    async allocate(
        request: AllocationRequest
    ): Promise<Allocation[]> {

        // ── جميع مستودعات الشركة ──
        const warehouses = await this.warehouseRepo.findByCompany(
            request.companyId,
            request.transaction
        );

        const allocations: Allocation[] = [];

        // تتبع الكمية المتبقية لكل عنصر
        const remainingItems = new Map<number, any>(
            request.items.map(item => [
                item.variantId,
                {
                    ...item,
                    remaining: item.quantity
                }
            ])
        );

        // ── المرور على جميع المستودعات ──
        for (const warehouse of warehouses) {

            for (const [variantId, item] of remainingItems) {

                // العنصر اكتمل
                if (item.remaining <= 0) {
                    continue;
                }

                const inventory = await this.inventoryRepo.findForUpdate(
                    variantId,
                    warehouse.id,
                    request.companyId,
                    request.transaction
                );

                if (!inventory) {
                    continue;
                }

                // الكمية المتاحة = الكمية - المحجوز
                const available =
                    Math.max(0, inventory.quantity - inventory.reserved);

                if (available <= 0) {
                    continue;
                }

                // تخصيص أقل من المتاح أو المطلوب
                const allocateQty = Math.min(
                    available,
                    item.remaining
                );

                allocations.push({
                    orderItemId: item.orderItemId,
                    warehouseId: warehouse.id,
                    variantId,
                    quantity: allocateQty
                });

                // تحديث الكمية المتبقية
                item.remaining -= allocateQty;
            }
        }

        // ── التحقق من اكتمال التخصيص ──
        const notAllocated = Array
            .from(remainingItems.values())
            .filter(item => item.remaining > 0);

        if (notAllocated.length > 0) {
            throw new Error(
                `SPLIT_ALLOCATION_FAILED: ${notAllocated
                    .map(
                        item =>
                            `variant ${item.variantId} missing ${item.remaining}`
                    )
                    .join(", ")}`
            );
        }

        return allocations;
    }
}