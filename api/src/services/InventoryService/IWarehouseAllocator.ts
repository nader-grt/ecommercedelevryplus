import { Transaction } from "sequelize";

// ===================================================
// INTERFACES - الواجهات المشتركة
// ===================================================

export interface OrderItemInput {
    orderItemId: number;
    variantId: number;
    quantity: number;
}

export interface Allocation {
    orderItemId: number;
    warehouseId: number;
    variantId: number;
    quantity: number;
}

export interface AllocationRequest {
    companyId: number;
    items: OrderItemInput[];
    transaction: Transaction;
    customerLocation?: GeoLocation;  // للاستراتيجيات الجغرافية
}

export interface GeoLocation {
    lat: number;
    lng: number;
}

// ===================================================
// الواجهة المشتركة لكل الاستراتيجيات
// ===================================================

export interface IWarehouseAllocator {
    allocate(request: AllocationRequest): Promise<Allocation[]>;
}