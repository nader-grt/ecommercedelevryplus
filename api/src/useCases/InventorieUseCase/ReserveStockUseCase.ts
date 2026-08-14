import { Transaction, Op } from "sequelize";
import { sequelize } from "../../models/main";

import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";
import InventoryAuditRepo from "../../repo/InventoryAuditRepo/InventoryAuditRepo";

import ResolveWarehouseForItemService from "../../services/InventoryService/ResolveWarehouseForItemService";

// ======================================================
// DTO
// ======================================================

export interface ReserveStockDTO {
  orderId: number;

  userId: number;

  companyId: number;

  transaction?: Transaction;
}

// ======================================================
// Result
// ======================================================

export interface ReserveStockResult {
  success: boolean;

  orderId: number;

  message: string;
}

// ======================================================
// UseCase
// ======================================================

export default class ReserveStockUseCase {
  constructor(
    private readonly orderRepo: OrderRepo,

    private readonly inventoryRepo: InventorieRepo,

    private readonly movementRepo: InventoryMovementRepo,

    private readonly reservationRepo: InventoryReservationRepo,

    private readonly auditRepo: InventoryAuditRepo,

    private readonly warehouseResolver:
      ResolveWarehouseForItemService
  ) {}

  // ====================================================
  // EXECUTE
  // ====================================================

  async execute(
    dto: ReserveStockDTO
  ): Promise<ReserveStockResult> {

    this.validate(dto);

    // ==================================================
    // CASE 1
    //
    // Transaction comes from parent UseCase
    //
    // CreateOrderByAdminUseCase owns transaction
    // ==================================================

    if (dto.transaction) {

      return await this.executeWithTransaction(
        dto,
        dto.transaction
      );
    }

    // ==================================================
    // CASE 2
    //
    // No external transaction
    //
    // ReserveStockUseCase creates its own transaction
    // ==================================================

    return await this.executeWithOwnTransaction(dto);
  }

  // ====================================================
  // External Transaction
  // ====================================================

  private async executeWithTransaction(
    dto: ReserveStockDTO,

    transaction: Transaction
  ): Promise<ReserveStockResult> {

    /*
     * IMPORTANT:
     *
     * This method DOES NOT:
     *
     * transaction.commit()
     *
     * transaction.rollback()
     *
     *
     * because the parent UseCase owns
     * the transaction.
     */

    return await this.tryExecute(
      dto,
      transaction
    );
  }

  // ====================================================
  // Own Transaction
  // ====================================================

  private async executeWithOwnTransaction(
    dto: ReserveStockDTO
  ): Promise<ReserveStockResult> {

    const transaction =
      await sequelize.transaction();

    try {

      const result =
        await this.tryExecute(
          dto,
          transaction
        );

      await transaction.commit();

      return result;

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }

  // ====================================================
  // Business Logic
  // ====================================================

  private async tryExecute(
    dto: ReserveStockDTO,

    transaction: Transaction
  ): Promise<ReserveStockResult> {

    // ==================================================
    // 1. Find Order
    // ==================================================

    const order =
      await this.orderRepo.FindOrderById(
        dto.orderId,
        transaction
      );

    if (!order) {

      throw new Error(
        `Order ${dto.orderId} not found`
      );
    }

    // ==================================================
    // 2. Validate Company
    // ==================================================

    if (
      order.companyId !== dto.companyId
    ) {

      throw new Error(
        "Order does not belong to this company"
      );
    }

    // ==================================================
    // 3. Idempotency Check
    // ==================================================
    //
    // Prevent reserving the same order twice.
    // ==================================================

    const existingReservation =
      await this.reservationRepo.findByOrderId(
        dto.orderId,
        transaction
      );

    if (
      existingReservation &&
      existingReservation.length > 0
    ) {

      return {

        success: true,

        orderId: dto.orderId,

        message:
          "Stock already reserved for this order"
      };
    }

    // ==================================================
    // 4. Get Order Items
    // ==================================================

    const orderItems =
      await this.orderRepo.getOrderItems(
        dto.orderId,
        transaction
      );

    if (
      !orderItems ||
      orderItems.length === 0
    ) {

      throw new Error(
        `Order ${dto.orderId} has no items`
      );
    }

    // ==================================================
    // 5. Process Every OrderItem
    // ==================================================

    for (
      const orderItem of orderItems
    ) {

      // ----------------------------------------------
      // Validate quantity
      // ----------------------------------------------

      if (
        !orderItem.quantity ||
        orderItem.quantity <= 0
      ) {

        throw new Error(
          `Invalid quantity for OrderItem ${orderItem.id}`
        );
      }

      // ----------------------------------------------
      // Resolve Warehouse
      // ----------------------------------------------

      const warehouse =
        await this.warehouseResolver.resolve(
          {
            companyId:
              dto.companyId,

            variantId:
              orderItem.variantId,

            quantity:
              orderItem.quantity
          },

          transaction
        );

      if (!warehouse) {

        throw new Error(

          `No warehouse available for variant ${orderItem.variantId}`

        );
      }

      // ----------------------------------------------
      // Find Inventory
      // ----------------------------------------------

      const inventory =
        await this.inventoryRepo
          .findByVariantAndWarehouse(
            orderItem.variantId,
            warehouse.id,
            dto.companyId,
            transaction
          );

      if (!inventory) {

        throw new Error(

          `Inventory not found for variant ${orderItem.variantId} in warehouse ${warehouse.id}`

        );
      }

      // ----------------------------------------------
      // Lock Inventory
      // ----------------------------------------------

      const lockedInventory =
        await this.inventoryRepo
          .findOneForUpdate(
            inventory.id,
            transaction
          );

      if (!lockedInventory) {

        throw new Error(
          `Inventory ${inventory.id} not found`
        );
      }

      // ----------------------------------------------
      // Available Stock
      // ----------------------------------------------

      const available =
        Number(
          lockedInventory.quantity
        ) -
        Number(
          lockedInventory.reserved
        );

      // ----------------------------------------------
      // Check Stock
      // ----------------------------------------------

      if (
        available <
        orderItem.quantity
      ) {

        throw new Error(

          `Insufficient stock for variant ${orderItem.variantId}. Available: ${available}, requested: ${orderItem.quantity}`

        );
      }

      // ----------------------------------------------
      // Reserve
      // ----------------------------------------------

      const oldReserved =
        Number(
          lockedInventory.reserved
        );

      const newReserved =
        oldReserved +
        Number(
          orderItem.quantity
        );

      // ----------------------------------------------
      // Update Inventory
      // ----------------------------------------------

      await this.inventoryRepo
        .updateReserved(
          lockedInventory.id,

          newReserved,

          transaction
        );

      // ----------------------------------------------
      // Create Reservation
      // ----------------------------------------------

      await this.reservationRepo.create(
        {
          orderId:
            dto.orderId,

          orderItemId:
            orderItem.id,

          inventoryId:
            lockedInventory.id,

          variantId:
            orderItem.variantId,

          warehouseId:
            warehouse.id,

          quantity:
            orderItem.quantity,

          companyId:
            dto.companyId,

          status:
            "RESERVED"
        },

        transaction
      );

      // ----------------------------------------------
      // Inventory Movement
      // ----------------------------------------------

      await this.movementRepo.create(
        {
          inventoryId:
            lockedInventory.id,

          variantId:
            orderItem.variantId,

          warehouseId:
            warehouse.id,

          orderId:
            dto.orderId,

          quantity:
            orderItem.quantity,

          type:
            "RESERVE",

          companyId:
            dto.companyId,

          userId:
            dto.userId
        },

        transaction
      );

      // ----------------------------------------------
      // Audit
      // ----------------------------------------------

      await this.auditRepo.create(
        {
          inventoryId:
            lockedInventory.id,

          variantId:
            orderItem.variantId,

          warehouseId:
            warehouse.id,

          orderId:
            dto.orderId,

          oldReserved,

          newReserved,

          quantity:
            orderItem.quantity,

          action:
            "RESERVE",

          userId:
            dto.userId,

          companyId:
            dto.companyId
        },

        transaction
      );
    }

    // ==================================================
    // 6. Success
    // ==================================================

    return {

      success: true,

      orderId:
        dto.orderId,

      message:
        "Stock reserved successfully"
    };
  }

  // ====================================================
  // Validation
  // ====================================================

  private validate(
    dto: ReserveStockDTO
  ): void {

    if (!dto) {

      throw new Error(
        "ReserveStock request is required"
      );
    }

    if (
      !Number.isInteger(
        dto.orderId
      ) ||
      dto.orderId <= 0
    ) {

      throw new Error(
        "Valid orderId is required"
      );
    }

    if (
      !Number.isInteger(
        dto.userId
      ) ||
      dto.userId <= 0
    ) {

      throw new Error(
        "Valid userId is required"
      );
    }

    if (
      !Number.isInteger(
        dto.companyId
      ) ||
      dto.companyId <= 0
    ) {

      throw new Error(
        "Valid companyId is required"
      );
    }
  }
}