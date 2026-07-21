import { Transaction, Op } from "sequelize";
import { sequelize } from "../../models/main";

import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";
import InventoryAuditRepo from "../../repo/InventoryAuditRepo/InventoryAuditRepo";

import InventoryDomain, { InventoryError } from "../../models/domain/InventorieDomain/InventorieDomain";
import ResolveWarehouseForItemService from "../../services/InventoryService/ResolveWarehouseForItemService";

// ── Interfaces ──
export interface ReserveStockCommand {
    orderId: number;
    userId: number;
    companyId: number;
}

export interface ReservedItem {
    orderItemId: number;
    variantId: number;
    warehouseId: number;
    quantity: number;
    reservationId: number;
}

export interface ReserveStockResult {
    success: boolean;
    message: string;
    orderId: number;
    reservedItems: ReservedItem[];
    errorCode?: string;
}

// ── Custom Error ──
class ReservationError extends Error {
    constructor(
        public readonly code: string,
        message: string
    ) {
        super(message);
        this.name = 'ReservationError';
    }
}

// ── Helper: Check if error is retryable ──
function isRetryableError(error: any): boolean {
    return (
        error?.name === 'SequelizeTimeoutError' ||
        error?.name === 'SequelizeDatabaseError' ||
        error?.original?.code === 'ER_LOCK_WAIT_TIMEOUT' ||
        error?.original?.code === 'ER_LOCK_DEADLOCK' ||
        error?.message?.includes('deadlock') ||
        error?.message?.includes('lock wait timeout')
    );
}

export default class ReserveStockUseCase {

    constructor(
        private readonly orderRepo: OrderRepo,
        private readonly inventoryRepo: InventorieRepo,
        private readonly movementRepo: InventoryMovementRepo,
        private readonly reservationRepo: InventoryReservationRepo,
        private readonly auditRepo: InventoryAuditRepo,
        private readonly warehouseResolver: ResolveWarehouseForItemService
    ) {}

    // ═══════════════════════════════════════════════════
    // PUBLIC: Main execution with retry logic
    // ═══════════════════════════════════════════════════
    public async execute(command: ReserveStockCommand): Promise<ReserveStockResult> {
        const MAX_RETRIES = 3;
        let lastError: any;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await this.tryExecute(command);
            } catch (error: any) {
                lastError = error;
                
                // Log for debugging
                console.error(`[ReserveStock] Attempt ${attempt} failed:`, {
                    code: error instanceof ReservationError ? error.code : error?.name,
                    message: error.message,
                    isRetryable: isRetryableError(error)
                });

                // Don't retry business logic errors
                if (error instanceof ReservationError || error instanceof InventoryError) {
                    throw error;
                }

                // Retry on lock/deadlock issues, but not on last attempt
                if (isRetryableError(error) && attempt < MAX_RETRIES) {
                    const delay = Math.pow(2, attempt) * 100; // Exponential backoff: 200ms, 400ms
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }

                throw new ReservationError(
                    'UNKNOWN_ERROR',
                    `Unexpected error after ${attempt} attempts: ${error.message}`
                );
            }
        }

        throw lastError;
    }

    private async tryExecute(command: ReserveStockCommand): Promise<ReserveStockResult> {
        return sequelize.transaction(
            {
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // ← CHANGED: Less strict than SERIALIZABLE
               // retry: { max: 1 } // We handle retries manually
            },
            async (transaction: Transaction) => {
                return this.runReservationFlow(command, transaction);
            }
        );
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: Full reservation flow
    // ═══════════════════════════════════════════════════
    private async runReservationFlow(
        command: ReserveStockCommand,
        transaction: Transaction
    ): Promise<ReserveStockResult> {

        console.log(`[ReserveStock] Starting for orderId=${command.orderId}, companyId=${command.companyId}`);

        // ── STEP 0: Idempotency check ──
        const existingReservations = await this.reservationRepo.findAll({
            where: {
                orderId: command.orderId,
                status: { [Op.ne]: "released" }
            },
            transaction
        });

        if (existingReservations.length > 0) {
            throw new ReservationError(
                'ORDER_ALREADY_RESERVED',
                `Order ${command.orderId} has ${existingReservations.length} active reservations`
            );
        }

        // ── STEP 1: Load order ──
        const order = await this.orderRepo.FindOrderById(command.orderId, transaction);
        console.log(`[ReserveStock] Order loaded:`, { id: order?.id, status: order?.status, companyId: order?.companyId });

        if (!order) {
            throw new ReservationError('ORDER_NOT_FOUND', `Order ${command.orderId} not found`);
        }

        // ── STEP 2: Validate order ──
        this.validateOrder(order, command.companyId);

        // ── STEP 3: Load items ──
        const orderWithItems = await this.orderRepo.FindOrderWithItems(command.orderId, transaction);
        const items = orderWithItems?.items;

        console.log(`[ReserveStock] Items loaded:`, items?.map((i: any) => ({ id: i.id, variantId: i.variantId, qty: i.quantity })));

        if (!items || items.length === 0) {
            throw new ReservationError('NO_ITEMS', `Order ${command.orderId} has no items`);
        }

        // ── STEP 4: Validate items ──
        this.validateItems(items);

        // ── STEP 5: Resolve warehouse ──
        const allocations = await this.warehouseResolver.executeService(
            order.companyId,
            items.map((item: any) => ({
                orderItemId: item.id,
                variantId: item.variantId,
                quantity: item.quantity
            })),
            transaction
        );

        console.log(`[ReserveStock] Allocations:`, allocations);

        if (!allocations || allocations.length === 0) {
            throw new ReservationError('NO_WAREHOUSE_CAN_FULFILL', 'No warehouse can fulfill this order');
        }

        if (allocations.length !== items.length) {
            throw new ReservationError(
                'PARTIAL_ALLOCATION',
                `Only ${allocations.length}/${items.length} items could be allocated`
            );
        }

        // ── STEP 6: Reserve each allocation ──
        const reservedItems: ReservedItem[] = [];

        for (const allocation of allocations) {
            console.log(`[ReserveStock] Reserving allocation:`, allocation);
            const reservedItem = await this.reserveAllocation(
                allocation,
                order,
                command.userId,
                transaction
            );
            reservedItems.push(reservedItem);
            console.log(`[ReserveStock] Reserved successfully:`, reservedItem);
        }

        // ── STEP 7: Update order status ──
        console.log(`[ReserveStock] Updating order ${order.id} status to RESERVED`);
        await this.orderRepo.updateStatus(order.id, "RESERVED", transaction);

        // ── STEP 8: Return success ──
        console.log(`[ReserveStock] COMPLETED for order ${command.orderId}`);
        return {
            success: true,
            message: "Stock reserved successfully",
            orderId: command.orderId,
            reservedItems
        };
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: Reserve single allocation (FIXED)
    // ═══════════════════════════════════════════════════
    private async reserveAllocation(
        allocation: any,
        order: any,
        userId: number,
        transaction: Transaction
    ): Promise<ReservedItem> {

        // 🔧 FIX 1: More specific query with logging
        const query = {
            variantId: allocation.variantId,
            warehouseId: allocation.warehouseId,
            companyId: order.companyId
        };
        console.log(`[ReserveAllocation] Locking inventory with query:`, query);

        // 🔧 FIX 2: Use SKIP LOCKED or handle missing rows gracefully
        const inventoryRecord = await this.inventoryRepo.findOneForUpdate(query, transaction);

        if (!inventoryRecord) {
            // 🔧 FIX 3: Better error with details for debugging
            throw new ReservationError(
                'INVENTORY_NOT_FOUND',
                `No inventory record for variant=${allocation.variantId}, ` +
                `warehouse=${allocation.warehouseId}, company=${order.companyId}. ` +
                `Please ensure inventory row exists before reserving.`
            );
        }

        console.log(`[ReserveAllocation] Inventory locked:`, {
            id: inventoryRecord.id,
            qty: inventoryRecord.quantity,
            reserved: inventoryRecord.reserved
        });

        // ── 6.2: Create Domain ──
        const inventory = new InventoryDomain({
            id: inventoryRecord.id,
            companyId: inventoryRecord.companyId,
            variantId: inventoryRecord.variantId,
            warehouseId: inventoryRecord.warehouseId,
            quantity: Number(inventoryRecord.quantity),     // 🔧 FIX 4: Ensure number type
            reserved: Number(inventoryRecord.reserved)      // 🔧 FIX 4: Ensure number type
        });

        // ── 6.3: Execute reservation in Domain ──
        inventory.reserve(allocation.quantity, userId);

        // ── 6.4: Save inventory ──
        await this.inventoryRepo.update(
            inventoryRecord.id,
            {
                quantity: inventory.quantity,
                reserved: inventory.reserved
            },
            transaction
        );

        // ── 6.5: Create audit ──
        await this.auditRepo.create(
            {
                variantId: allocation.variantId,
                warehouseId: allocation.warehouseId,
                systemQuantity: inventoryRecord.quantity,
                actualQuantity: inventoryRecord.quantity,
                difference: 0,
                reason: `Stock reservation for order ${order.id}`,
                userId: userId
            },
            transaction
        );

        // ── 6.6: Create reservation record ──
        const reservation = await this.reservationRepo.create(
            {
                inventoryId: inventoryRecord.id,
                orderId: order.id,
                orderItemId: allocation.orderItemId,
                variantId: allocation.variantId,
                warehouseId: allocation.warehouseId,
                companyId: order.companyId,
                quantity: allocation.quantity,
                status: "pending"
            },
            transaction
        );

        // ── 6.7: Save movements from Domain ──
        const movements = inventory.pullMovements();
        for (const movement of movements) {
            await this.movementRepo.create(
                {
                    companyId: order.companyId,
                    warehouseId: allocation.warehouseId,
                    variantId: allocation.variantId,
                    quantity: movement?.quantity,
                    type: movement.type,
                    referenceId: order.id,
                    userId: userId,
                    note: movement?.note || `Order reservation ${order.id}`
                },
                transaction
            );
        }

        // ── 6.8: Update order item warehouse ──
        await this.orderRepo.updateOrderItem(
            allocation.orderItemId,
            { warehouseId: allocation.warehouseId },
            transaction
        );

        return {
            orderItemId: allocation.orderItemId,
            variantId: allocation.variantId,
            warehouseId: allocation.warehouseId,
            quantity: allocation.quantity,
            reservationId: reservation.id
        };
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: Validation methods (unchanged logic)
    // ═══════════════════════════════════════════════════
    private validateOrder(order: any, companyId: number): void {
        if (!order.companyId) {
            throw new ReservationError('ORDER_COMPANY_MISSING', 'Order company is missing');
        }
        if (order.companyId !== companyId) {
            throw new ReservationError(
                'COMPANY_MISMATCH',
                `Order belongs to company ${order.companyId}, not ${companyId}`
            );
        }
        if (order.status !== "pending") {
            throw new ReservationError(
                'INVALID_ORDER_STATUS',
                `Only pending orders can be reserved. Current: ${order.status}`
            );
        }
    }

    private validateItems(items: any[]): void {
        for (const item of items) {
            if (!item.variantId) {
                throw new ReservationError('MISSING_VARIANT', `Item ${item.id} has no variant`);
            }
            if (item.quantity <= 0) {
                throw new ReservationError(
                    'INVALID_QUANTITY',
                    `Invalid quantity for item ${item.id}: ${item.quantity}`
                );
            }
        }
    }
}