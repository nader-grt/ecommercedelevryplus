import { Transaction } from "sequelize";
import { IWarehouseAllocator, AllocationRequest, Allocation } from "./IWarehouseAllocator";
import IInventoryRepository from "../../repo/InventorieRepo/InventorieRepo";

// ===================================================
// PRIORITY WAREHOUSE STRATEGY
// استراتيجية أولوية المستودع
// ===================================================

/**
 * ما هي؟
 * تختار المستودع حسب الأولوية المحددة (1 = أعلى أولوية)
 * 
 * لماذا؟
 * - لا تحتاج GPS أو خدمة جغرافية
 * - أبسط في التنفيذ والصيانة
 * - العميل يتحكم في الأولوية
 * - مناسبة لتونس والدول التي لا تملك خدمات GPS متكاملة
 * 
 * كيف؟
 * 1. جلب المستودعات مرتبة حسب الأولوية (ASC)
 * 2. فحص كل مستودع من الأعلى أولوية
 * 3. أول مستودع يكفي ← نختاره
 * 
 * متى نستخدمها؟
 * - عند عدم توفر GPS
 * - عندما تكون الأولوية مهمة (مستودع رئيسي، مستودع احتياطي)
 * - عندما تكون المسافة غير مهمة
 */

export class PriorityWarehouseStrategy implements IWarehouseAllocator {

    constructor(
        private readonly inventoryRepo: IInventoryRepository
    ) {}

    // ═══════════════════════════════════════════════════
    // PUBLIC: تخصيص المستودع حسب الأولوية
    // ═══════════════════════════════════════════════════

    async allocate(request: AllocationRequest): Promise<Allocation[]> {
        
        // ── جلب المستودعات مرتبة حسب الأولوية ──
        // الأولوية 1 = أعلى أولوية
        const warehouses = await this.inventoryRepo.findWarehousesByPriority(
            request.companyId,
            request.transaction
        );

        console.log(`\n🏭 [PriorityStrategy] المستودعات المتاحة: ${warehouses.length}`);
        warehouses.forEach(w => 
            console.log(`   - مستودع #${w.id}: ${w.name} (أولوية: ${w.priority || 999})`)
        );

        // ── فحص كل مستودع من الأعلى أولوية ──
        for (const warehouse of warehouses) {
            
            console.log(`\n🔎 فحص مستودع #${warehouse.id} (${warehouse.name})...`);
            
            const canFulfill = await this.canFulfillAll(
                warehouse.id,
                request.companyId,
                request.items,
                request.transaction
            );

            if (canFulfill) {
                console.log(`✅ مستودع #${warehouse.id} يمكنه التلبية!`);
                
                // ✅ وجدنا مستودعاً يكفي
                return request.items.map(item => ({
                    orderItemId: item.orderItemId,
                    warehouseId: warehouse.id,
                    variantId: item.variantId,
                    quantity: item.quantity
                }));
            }

            console.log(`❌ مستودع #${warehouse.id} لا يمكنه التلبية`);
        }

        // ❌ لا يوجد مستودع يكفي
        console.log(`\n🚨 فشل: لا يوجد مستودع يمكنه تلبية الطلب`);
        return [];
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: فحص هل المستودع يكفي كل العناصر
    // ═══════════════════════════════════════════════════
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
                console.log(`   ❌ variantId ${item.variantId}: لا يوجد مخزون`);
                return false;
            }

            const available = inventory.quantity - inventory.reserved;
            
            console.log(`   📊 variantId ${item.variantId}: متاح ${available}, مطلوب ${item.quantity}`);

            if (available < item.quantity) {
                console.log(`   ❌ غير كافٍ`);
                return false;
            }
        }

        return true;
    }
}