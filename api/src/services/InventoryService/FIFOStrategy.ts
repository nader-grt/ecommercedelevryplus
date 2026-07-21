import { Transaction, Op } from "sequelize";
import { IWarehouseAllocator, AllocationRequest, Allocation } from "./IWarehouseAllocator";

// ── Repositories ──
import IWarehouseRepository from "../../repo/WareHouseRepo/WareHouseRepo";
import IInventoryRepository from "../../repo/InventorieRepo/InventorieRepo";
import WareHouseRepo from '../../repo/WareHouseRepo/WareHouseRepo';

// ===================================================
// FIFO STRATEGY
// استراتيجية أول داخل أول خارج
// ===================================================

/**
 * ما هي؟
 * First In First Out
 * تستخدم المخزون الأقدم أولاً
 * 
 * لماذا؟
 * - منتجات عادية (غير قابلة للانتهاء)
 * - تقليل المخزون القديم
 * - تقليل الاحتفاظ بالمخزون
 * 
 * كيف؟
 * 1. ترتيب المخزون حسب تاريخ الإدخال (الأقدم أولاً)
 * 2. استخدام الأقدم أولاً
 * 
 * ملاحظة: تحتاج تعديل في المخطط لإضافة تاريخ الإدخال
 */

export class FIFOStrategy implements IWarehouseAllocator {

    constructor(
        private readonly warehouseRepo: IWarehouseRepository,
        private readonly inventoryRepo: IInventoryRepository
    ) {}

    async allocate(request: AllocationRequest): Promise<Allocation[]> {
        
        // ── جلب المستودعات مع المخزون مرتب حسب التاريخ ──
        const warehouses = await this.warehouseRepo.findByCompanyWithInventory(
            request.companyId,
            request.transaction,
            { order: [['createdAt', 'ASC']] }  // الأقدم أولاً
        );

        // ── تجميع المخزون حسب المستودع ──
        const warehouseBatches = this.groupByWarehouse(warehouses);

        // ── نفس منطق Split لكن مع ترتيب FIFO ──
        const allocations: Allocation[] = [];
        const remainingItems = new Map(
            request.items.map(item => [
                item.variantId,
                { ...item, remaining: item.quantity }
            ])
        );

        for (const [warehouseId, batches] of warehouseBatches) {
            
            for (const batch of batches) {  // batch = دفعة واحدة من المخزون
                
                for (const [variantId, item] of remainingItems) {
                    
                    if (item.remaining <= 0) continue;
                    if (batch.variantId !== variantId) continue;

                    const allocateQty = Math.min(batch.available, item.remaining);

                    if (allocateQty > 0) {
                        allocations.push({
                            orderItemId: item.orderItemId,
                            warehouseId,
                            variantId,
                            quantity: allocateQty
                        });

                        item.remaining -= allocateQty;
                        batch.available -= allocateQty;
                    }
                }
            }
        }

        return allocations;
    }

    private groupByWarehouse(warehouses: any[]): Map<number, any[]> {
        const result = new Map();
        
        for (const warehouse of warehouses) {
            if (!result.has(warehouse.id)) {
                result.set(warehouse.id, []);
            }
            result.get(warehouse.id).push(...warehouse.batches);
        }
        
        return result;
    }
}