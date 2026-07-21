// services/InventoryService/ClosestWarehouseStrategy.ts

import { Transaction } from "sequelize";
import { IWarehouseAllocator, AllocationRequest, Allocation, GeoLocation } from "./IWarehouseAllocator";
import IInventoryRepository from "../../repo/InventorieRepo/InventorieRepo";

// ===================================================
// CLOSEST WAREHOUSE STRATEGY - بدون IGeoService
// استراتيجية أقرب مستودع - بدون خدمة خارجية
// ===================================================

/**
 * ما هي؟
 * تختار أقرب مستودع للعميل
 * 
 * لماذا بدون IGeoService؟
 * - لا توجد خدمة جغرافية متاحة
 * - نستخدم قاعدة البيانات مباشرة
 * - نستخدم صيغة هافرسين (Haversine) للمسافة
 * 
 * كيف؟
 * 1. العميل يرسل موقعه (lat, lng)
 * 2. نجلب المستودعات مع إحداثياتها
 * 3. نحسب المسافة بصيغة هافرسين
 * 4. نختار الأقرب الذي يكفي
 */

export class ClosestWarehouseStrategy implements IWarehouseAllocator {

    constructor(
        private readonly inventoryRepo: IInventoryRepository
        // ❌ لا IGeoService
    ) {}

    async allocate(request: AllocationRequest): Promise<Allocation[]> {
        
        if (!request.customerLocation) {
            throw new Error('MISSING_CUSTOMER_LOCATION: أرسل { lat, lng } في الطلب');
        }

        const { lat: customerLat, lng: customerLng } = request.customerLocation;

        // ── جلب المستودعات مع إحداثياتها ──
        const warehouses = await this.inventoryRepo.findWarehousesWithLocation(
            request.companyId,
            request.transaction
        );

        if (warehouses.length === 0) {
            throw new Error('NO_WAREHOUSES_WITH_LOCATION: أضف إحداثيات للمستودعات');
        }

        // ── حساب المسافة لكل مستودع ──
        const warehousesWithDistance = warehouses.map((warehouse:any) => ({
            warehouseId: warehouse.id,
            distance: this.calculateDistance(
                customerLat,
                customerLng,
                warehouse.lat,
                warehouse.lng
            )
        }));

        // ── ترتيب حسب المسافة ──
        warehousesWithDistance.sort((a, b) => a.distance - b.distance);

        // ─ّ فحص من الأقرب ──
        for (const { warehouseId } of warehousesWithDistance) {
            
            const canFulfill = await this.canFulfillAll(
                warehouseId,
                request.companyId,
                request.items,
                request.transaction
            );

            if (canFulfill) {
                return request.items.map(item => ({
                    orderItemId: item.orderItemId,
                    warehouseId,
                    variantId: item.variantId,
                    quantity: item.quantity
                }));
            }
        }

        return [];
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: صيغة هافرسين (Haversine Formula)
    // ═══════════════════════════════════════════════════

    /**
     * ما هي؟
     * تحسب المسافة بين نقطتين على سطح الأرض
     * 
     * لماذا؟
     * - لا تحتاج خدمة خارجية
     * - دقيقة بما يكفي للمستودعات
     * - سريعة الحساب
     * 
     * كيف؟
     * تستخدم خطوط الطول والعرض مباشرة
     */

    private calculateDistance(
        lat1: number, 
        lng1: number, 
        lat2: number, 
        lng2: number
    ): number {

        const R = 6371; // نصف قطر الأرض بالكيلومتر

        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);

        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // المسافة بالكيلومتر
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    // ── فحص هل المستودع يكفي ──
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