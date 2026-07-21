// services/InventoryService/WarehouseAllocationFactory.ts

import { AllocationStrategy } from "./AllocationStrategy";
import { ClosestWarehouseStrategy } from "./ClosestWarehouseStrategy";
import { FEFOStrategy } from "./FEFOStrategy";
import { FIFOStrategy } from "./FIFOStrategy";
import { IWarehouseAllocator } from "./IWarehouseAllocator";
import { PriorityWarehouseStrategy } from "./PriorityWarehouseStrategy";
import { SingleWarehouseStrategy } from "./SingleWarehouseStrategy";
import { SplitFulfillmentStrategy } from "./SplitFulfillmentStrategy";

export class WarehouseAllocationFactory {

    constructor(
        private single: SingleWarehouseStrategy,
        private split: SplitFulfillmentStrategy,
        private closest: ClosestWarehouseStrategy,
        private priority: PriorityWarehouseStrategy,  // ✅ جديد
        private fifo: FIFOStrategy,
        private fefo: FEFOStrategy,
    ) {}

    get(strategy: AllocationStrategy): IWarehouseAllocator {
        
        switch(strategy) {
            
            case AllocationStrategy.SINGLE_WAREHOUSE:
                return this.single;

            case AllocationStrategy.SPLIT_FULFILLMENT:
                return this.split;

            case AllocationStrategy.CLOSEST_WAREHOUSE:
                // إذا لا يوجد GPS، استخدم Priority
                return this.priority;
            
            case AllocationStrategy.PRIORITY_WAREHOUSE:  // ✅ جديد
                return this.priority;

            case AllocationStrategy.FIFO:
                return this.fifo;

            case AllocationStrategy.FEFO:
                return this.fefo;

            default:
                // افتراضي: Priority (الأبسط)
                return this.priority;
        }
    }
}