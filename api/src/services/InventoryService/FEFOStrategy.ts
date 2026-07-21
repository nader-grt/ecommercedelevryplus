import { Op, Transaction } from "sequelize";
import { IWarehouseAllocator, AllocationRequest, Allocation } from "./IWarehouseAllocator";

// ── Repositories ──
import IWarehouseRepository from "../../repo/WareHouseRepo/WareHouseRepo";
import IInventoryRepository from "../../repo/InventorieRepo/InventorieRepo";

// ===================================================
// FEFO STRATEGY
// استراتيجية أول يُنتهي أول خارج
// ===================================================

/**
 * ما هي؟
 * First Expired First Out
 * تستخدم المنتج الأقرب لتاريخ الانتهاء أولاً
 * 
 * لماذا؟
 * - منتجات قابلة للانتهاء (أدوية، أغذية)
 * - تقليل الهالك (المنتجات المُتلفة)
 * - الامتثال للمعايير
 * 
 * كيف؟
 * 1. ترتيب المخزون حسب تاريخ الانتهاء (الأقرب أولاً)
 * 2. استخدام الأقرب للانتهاء أولاً
 * 
 * ملاحظة: تحتاج تعديل في المخطط لإضافة تاريخ الانتهاء
 */

export class FEFOStrategy implements IWarehouseAllocator {

    constructor(
        private readonly warehouseRepo: IWarehouseRepository,
        private readonly inventoryRepo: IInventoryRepository
    ) {}

    async allocate(request: AllocationRequest): Promise<Allocation[]> {
        
        // ── جلب المستودعات مع المخزون مرتب حسب تاريخ الانتهاء ──
        const warehouses = await this.warehouseRepo.findByCompanyWithInventory(
            request.companyId,
            request.transaction,
            { 
                order: [['expiryDate', 'ASC']],  // الأقرب للانتهاء أولاً
                where: { expiryDate: { [Op.gte]: new Date() } }  // غير منتهي
            }
        );

        // ── نفس منطق FIFO لكن مع ترتيب expiryDate ──
        const allocations: Allocation[] = [];
        const remainingItems = new Map(
            request.items.map(item => [
                item.variantId,
                { ...item, remaining: item.quantity }
            ])
        );

        for (const warehouse of warehouses) {
            
            for (const batch of warehouse.batches) {
                
                for (const [variantId, item] of remainingItems) {
                    
                    if (item.remaining <= 0) continue;
                    if (batch.variantId !== variantId) continue;

                    const allocateQty = Math.min(batch.available, item.remaining);

                    if (allocateQty > 0) {
                        allocations.push({
                            orderItemId: item.orderItemId,
                            warehouseId: warehouse.id,
                            variantId,
                            quantity: allocateQty
                        });

                        item.remaining -= allocateQty;
                    }
                }
            }
        }

        return allocations;
    }
}