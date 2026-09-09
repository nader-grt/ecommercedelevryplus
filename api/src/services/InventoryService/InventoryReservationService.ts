import { Transaction } from "sequelize";

import InventorieRepo
    from "../../repo/InventorieRepo/InventorieRepo";

import InventoryMovementRepo
    from "../../repo/MovementRepo/InventoryMovementRepo";

import InventoryReservationRepo
    from "../../repo/InventoryReservationRepo/InventoryReservationRepo";

import InventoryAuditRepo
    from "../../repo/InventoryAuditRepo/InventoryAuditRepo";


// ======================================================
// RESERVATION STATUS
// ======================================================

export enum ReservationStatus {
    RESERVED = "RESERVED"
}


// ======================================================
// RESERVATION SOURCE
// ======================================================
//
// هذه ليست ضرورية مباشرة إذا لم تكن موجودة
// في Database Schema.
//
// أضفتها لتكون جاهزة مستقبلاً.
//

export enum ReservationSource {
    ORDER = "ORDER",
    MANUAL = "MANUAL"
}


// ======================================================
// INPUT
// ======================================================

export interface InventoryReservationInput {

    // ==================================================
    // LOCKED INVENTORY
    // ==================================================
    //
    // IMPORTANT:
    //
    // يجب أن يكون الـ Inventory الذي يدخل هنا
    // تم عمل FOR UPDATE عليه مسبقاً.
    //
    // لا نقوم بعمل Query جديد داخل الـ Service.
    //

    inventory: any;


    // ==================================================
    // PRODUCT
    // ==================================================

    variantId: number;


    // ==================================================
    // WAREHOUSE
    // ==================================================

    warehouseId: number;


    // ==================================================
    // QUANTITY
    // ==================================================

    quantity: number;


    // ==================================================
    // COMPANY
    // ==================================================

    companyId: number;


    // ==================================================
    // USER
    // ==================================================

    userId: number;


    // ==================================================
    // ORDER CONTEXT
    // ==================================================
    //
    // Optional لأن الـ Service سيكون قابلاً
    // للاستعمال مستقبلاً مع Manual Reservation.
    //

    orderId?: number;

    orderItemId?: number;


    // ==================================================
    // RESERVATION SOURCE
    // ==================================================

    source?: ReservationSource;


    // ==================================================
    // REASON
    // ==================================================

    reason?: string;


    // ==================================================
    // TRANSACTION
    // ==================================================

    transaction: Transaction;
}


// ======================================================
// RESULT
// ======================================================

export interface InventoryReservationResult {

    success: boolean;

    inventoryId: number;

    variantId: number;

    warehouseId: number;

    quantity: number;

    systemQuantity: number;

    oldReserved: number;

    newReserved: number;

    oldAvailable: number;

    newAvailable: number;

    reservation: any;
}


// ======================================================
// SERVICE
// ======================================================

export default class InventoryReservationService {

    constructor(

        private readonly inventoryRepo:
            InventorieRepo,

        private readonly movementRepo:
            InventoryMovementRepo,

        private readonly reservationRepo:
            InventoryReservationRepo,

        private readonly auditRepo:
            InventoryAuditRepo

    ) {}


    // ==================================================
    // RESERVE
    // ==================================================

    public async reserve(
        input: InventoryReservationInput
    ): Promise<InventoryReservationResult> {


        // ================================================
        // 1. VALIDATE INPUT
        // ================================================

        this.validateInput(input);


        // ================================================
        // 2. GET LOCKED INVENTORY
        // ================================================

        const lockedInventory =
            input.inventory;


        if (!lockedInventory) {

            throw new Error(
                "Locked inventory is required"
            );
        }


        // ================================================
        // 3. INVENTORY ID VALIDATION
        // ================================================

        if (

            !Number.isInteger(
                Number(lockedInventory.id)
            ) ||

            Number(lockedInventory.id) <= 0

        ) {

            throw new Error(
                "Invalid locked inventory"
            );
        }


        // ================================================
        // 4. COMPANY SAFETY CHECK
        // ================================================

        if (

            Number(
                lockedInventory.companyId
            ) !==
            Number(
                input.companyId
            )

        ) {

            throw new Error(

                `Inventory ${lockedInventory.id} ` +
                `does not belong to company ` +
                `${input.companyId}`

            );
        }


        // ================================================
        // 5. VARIANT SAFETY CHECK
        // ================================================
        //
        // حماية إضافية مهمة جداً.
        //
        // لا نريد مثلاً:
        //
        // Variant A
        // ↓
        // بالخطأ
        // Inventory خاص بـ Variant B
        //

        if (

            Number(
                lockedInventory.variantId
            ) !==
            Number(
                input.variantId
            )

        ) {

            throw new Error(

                `Inventory ${lockedInventory.id} ` +
                `does not belong to variant ` +
                `${input.variantId}`

            );
        }


        // ================================================
        // 6. WAREHOUSE SAFETY CHECK
        // ================================================

        if (

            Number(
                lockedInventory.warehouseId
            ) !==
            Number(
                input.warehouseId
            )

        ) {

            throw new Error(

                `Inventory ${lockedInventory.id} ` +
                `does not belong to warehouse ` +
                `${input.warehouseId}`

            );
        }


        // ================================================
        // 7. CURRENT INVENTORY DATA
        // ================================================

        const systemQuantity =
            Number(
                lockedInventory.quantity
            );


        const oldReserved =
            Number(
                lockedInventory.reserved || 0
            );


        // ================================================
        // 8. INVENTORY DATA VALIDATION
        // ================================================

        if (

            !Number.isFinite(
                systemQuantity
            ) ||

            systemQuantity < 0

        ) {

            throw new Error(

                `Invalid inventory quantity ` +
                `for inventory ${lockedInventory.id}`

            );
        }


        if (

            !Number.isFinite(
                oldReserved
            ) ||

            oldReserved < 0

        ) {

            throw new Error(

                `Invalid reserved quantity ` +
                `for inventory ${lockedInventory.id}`

            );
        }


        // ================================================
        // 9. CURRENT AVAILABLE STOCK
        // ================================================

        const oldAvailable =
            systemQuantity -
            oldReserved;


        // ================================================
        // 10. CONSISTENCY CHECK
        // ================================================
        //
        // لا يجب أن يكون Reserved أكبر من Quantity.
        //
        // مثال خاطئ:
        //
        // Quantity = 10
        // Reserved = 15
        //

        if (oldAvailable < 0) {

            throw new Error(

                `Inventory inconsistency detected. ` +
                `Quantity: ${systemQuantity}, ` +
                `Reserved: ${oldReserved}`

            );
        }


        // ================================================
        // 11. STOCK AVAILABILITY CHECK
        // ================================================

        if (

            oldAvailable <
            input.quantity

        ) {

            throw new Error(

                `Insufficient stock for variant ` +
                `${input.variantId}. ` +
                `Available: ${oldAvailable}, ` +
                `Requested: ${input.quantity}`

            );
        }


        // ================================================
        // 12. CALCULATE NEW RESERVED
        // ================================================

        const newReserved =
            oldReserved +
            input.quantity;


        // ================================================
        // 13. CALCULATE NEW AVAILABLE
        // ================================================

        const newAvailable =
            systemQuantity -
            newReserved;


        // ================================================
        // 14. UPDATE INVENTORY
        // ================================================
        //
        // IMPORTANT:
        //
        // نحن لا نغير Quantity.
        //
        // Quantity يبقى كما هو.
        //
        // فقط Reserved يتغير.
        //
        // مثال:
        //
        // Quantity: 100
        // Reserved: 20 → 30
        // Available: 80 → 70
        //

        await this.inventoryRepo
            .updateReserved(

                lockedInventory.id,

                newReserved,

                input.transaction

            );


        // ================================================
        // 15. CREATE RESERVATION
        // ================================================
        //
        // Reservation يمثل:
        //
        // لماذا تم حجز المخزون؟
        //
        // ومن المسؤول عنه؟
        //

        const reservation =
            await this.reservationRepo.create(

                {

                    // ==============================
                    // ORDER REFERENCES
                    // ==============================

                    orderId:
                        input.orderId,

                    orderItemId:
                        input.orderItemId,


                    // ==============================
                    // INVENTORY
                    // ==============================

                    inventoryId:
                        lockedInventory.id,


                    // ==============================
                    // VARIANT
                    // ==============================

                    variantId:
                        input.variantId,


                    // ==============================
                    // WAREHOUSE
                    // ==============================

                    warehouseId:
                        input.warehouseId,


                    // ==============================
                    // QUANTITY
                    // ==============================

                    quantity:
                        input.quantity,


                    // ==============================
                    // COMPANY
                    // ==============================

                    companyId:
                        input.companyId,


                    // ==============================
                    // STATUS
                    // ==============================
                    //
                    // IMPORTANT:
                    //
                    // في الكود الحالي لديك
                    // كان يوجد "confirmed".
                    //
                    // أنصح بتوحيد القيمة لاحقاً.
                    //
                    // لكن تأكد أن Database ENUM
                    // يسمح بـ RESERVED.
                    //

                    status:
                        ReservationStatus.RESERVED

                },

                input.transaction

            );


        // ================================================
        // 16. CREATE INVENTORY MOVEMENT
        // ================================================

        await this.movementRepo.create(

            {

                // ==============================
                // INVENTORY
                // ==============================

                inventoryId:
                    lockedInventory.id,


                // ==============================
                // VARIANT
                // ==============================

                variantId:
                    input.variantId,


                // ==============================
                // WAREHOUSE
                // ==============================

                warehouseId:
                    input.warehouseId,


                // ==============================
                // ORDER
                // ==============================

                orderId:
                    input.orderId,


                // ==============================
                // QUANTITY
                // ==============================

                quantity:
                    input.quantity,


                // ==============================
                // TYPE
                // ==============================

                type:
                    "RESERVE",


                // ==============================
                // COMPANY
                // ==============================

                companyId:
                    input.companyId,


                // ==============================
                // USER
                // ==============================

                userId:
                    input.userId

            },

            input.transaction

        );


        // ================================================
        // 17. CREATE INVENTORY AUDIT
        // ================================================
        //
        // Reservation لا يغير Physical Stock.
        //
        // مثال:
        //
        // BEFORE:
        //
        // Quantity = 100
        // Reserved = 20
        // Available = 80
        //
        // Reserve 10
        //
        // AFTER:
        //
        // Quantity = 100
        // Reserved = 30
        // Available = 70
        //

        await this.auditRepo.create(

            {

                inventoryId:
                    lockedInventory.id,


                variantId:
                    input.variantId,


                warehouseId:
                    input.warehouseId,


                orderId:
                    input.orderId,


                systemQuantity:
                    systemQuantity,


                actualQuantity:
                    systemQuantity,


                difference:
                    0,


                reason:

                    input.reason ||

                    `Stock reservation: ` +
                    `${input.quantity} unit(s) reserved. ` +

                    `Available stock changed from ` +
                    `${oldAvailable} to ${newAvailable}. ` +

                    `Reserved quantity changed from ` +
                    `${oldReserved} to ${newReserved}.`,


                userId:
                    input.userId,


                companyId:
                    input.companyId

            },

            input.transaction

        );


        // ================================================
        // 18. RETURN RESULT
        // ================================================

        return {

            success:
                true,


            inventoryId:
                lockedInventory.id,


            variantId:
                input.variantId,


            warehouseId:
                input.warehouseId,


            quantity:
                input.quantity,


            systemQuantity:
                systemQuantity,


            oldReserved:
                oldReserved,


            newReserved:
                newReserved,


            oldAvailable:
                oldAvailable,


            newAvailable:
                newAvailable,


            reservation:
                reservation

        };
    }


    // ==================================================
    // INPUT VALIDATION
    // ==================================================

    private validateInput(
        input: InventoryReservationInput
    ): void {


        // ================================================
        // INPUT
        // ================================================

        if (!input) {

            throw new Error(
                "Reservation input is required"
            );
        }


        // ================================================
        // INVENTORY
        // ================================================

        if (!input.inventory) {

            throw new Error(
                "Locked inventory is required"
            );
        }


        // ================================================
        // QUANTITY
        // ================================================

        if (

            !Number.isFinite(
                Number(input.quantity)
            ) ||

            Number(input.quantity) <= 0

        ) {

            throw new Error(
                "Valid reservation quantity is required"
            );
        }


        // ================================================
        // VARIANT ID
        // ================================================

        if (

            !Number.isInteger(
                Number(input.variantId)
            ) ||

            Number(input.variantId) <= 0

        ) {

            throw new Error(
                "Valid variantId is required"
            );
        }


        // ================================================
        // WAREHOUSE ID
        // ================================================

        if (

            !Number.isInteger(
                Number(input.warehouseId)
            ) ||

            Number(input.warehouseId) <= 0

        ) {

            throw new Error(
                "Valid warehouseId is required"
            );
        }


        // ================================================
        // COMPANY ID
        // ================================================

        if (

            !Number.isInteger(
                Number(input.companyId)
            ) ||

            Number(input.companyId) <= 0

        ) {

            throw new Error(
                "Valid companyId is required"
            );
        }


        // ================================================
        // USER ID
        // ================================================

        if (

            !Number.isInteger(
                Number(input.userId)
            ) ||

            Number(input.userId) <= 0

        ) {

            throw new Error(
                "Valid userId is required"
            );
        }


        // ================================================
        // TRANSACTION
        // ================================================

        if (!input.transaction) {

            throw new Error(
                "Transaction is required"
            );
        }
    }
}