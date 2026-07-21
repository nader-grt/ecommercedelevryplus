// ===================================================
// ENUM - أنواع الاستراتيجيات
// ===================================================

export enum AllocationStrategy {
    SINGLE_WAREHOUSE = 'SINGLE_WAREHOUSE',
    SPLIT_FULFILLMENT = 'SPLIT_FULFILLMENT',
    CLOSEST_WAREHOUSE = 'CLOSEST_WAREHOUSE',
    PRIORITY_WAREHOUSE = 'PRIORITY_WAREHOUSE',  // للمستقبل
    FIFO = 'FIFO',
    FEFO = 'FEFO'
}