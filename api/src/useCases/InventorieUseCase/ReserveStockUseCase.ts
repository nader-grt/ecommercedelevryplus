import { Transaction } from "sequelize";
import { sequelize } from "../../models/main";

import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";

import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";

import ResolveWarehouseForItemService
from "../../services/InventoryService/ResolveWarehouseForItemService";

export default class ReserveStockUseCase {

    constructor(

        private readonly orderRepo: OrderRepo,

        private readonly inventoryRepo: InventorieRepo,

        private readonly movementRepo: InventoryMovementRepo,

        private readonly reservationRepo: InventoryReservationRepo,

        private readonly warehouseResolver =
            new ResolveWarehouseForItemService()

    ) {}



    public async execute(
        orderId: number,
        user: any
    ) {

        return sequelize.transaction(

            async (transaction: Transaction) => {

                /*
                ===================================================
                STEP 1
                Load Order
                ===================================================
                */

                const order: any =
                    await this.orderRepo.FindOrderById(
                        orderId,
                        transaction
                    );


                    console.log("ooooooooooo order ", order)
                if (!order) {

                    throw new Error("Order not found");

                }

                /*
                ===================================================
                STEP 2
                Validate Order
                ===================================================
                */

                this.validateOrder(order);

                /*
                ===================================================
                STEP 3
                Load Order Items
                ===================================================
                */

                const orderWithItems: any =
                    await this.orderRepo.FindOrderWithItems(
                        orderId,
                        transaction
                    );

                    console.log(" is \t itemss  \t ",orderWithItems)

                const items = orderWithItems.items;

                if (!items || items.length === 0) {

                    throw new Error(
                        "Order has no items"
                    );

                }

                /*
                ===================================================
                STEP 4
                Validate Items
                ===================================================
                */

                this.validateItems(items);

                /*
                ===================================================
                STEP 5
                Resolve Warehouse Allocation

                Today:
                    Single Warehouse

                Tomorrow:
                    Split Fulfillment

                ===================================================
                */

                const allocations =
                await this.warehouseResolver.executeService(
                
                    order.companyId,
                
                    items.map((item: any) => ({
                
                        orderItemId: item.id,
                
                        variantId: item.variantId,
                
                        quantity: item.quantity
                
                    })),
                
                    transaction
                
                );


                    console.log("allocations is <_t ",allocations)

                /*
                ===================================================
                STEP 6
                Reserve Every Allocation
                ===================================================
                */

                for (const allocation of allocations) {

                    await this.reserveAllocation(

                        allocation,

                        order,

                        user,

                        transaction

                    );

                }

                /*
                ===================================================
                STEP 7
                Update Order Status
                ===================================================
                */

                await this.orderRepo.updateStatus(

                    order.id,

                    "RESERVED",

                    transaction

                );

                return {

                    success: true,

                    message: "Stock reserved successfully"

                };

            }

        );

    }



    /*
    ===================================================
    Validate Order
    ===================================================
    */

    private validateOrder(order: any) {

        if (!order.companyId) {

            throw new Error(
                "Order company is missing"
            );

        }

        if (order.status !== "pending") {

            throw new Error(
                "Only pending orders can reserve stock"
            );

        }

    }



    /*
    ===================================================
    Validate Items
    ===================================================
    */

    private validateItems(items: any[]) {

        for (const item of items) {

            if (!item.variantId) {

                throw new Error(

                    `Order Item ${item.id} has no Variant`

                );

            }

            if (item.quantity <= 0) {

                throw new Error(

                    `Invalid quantity for item ${item.id}`

                );

            }

        }

    }



    /*
    ===================================================
    Reserve One Allocation

    Allocation example

    {

        warehouseId,

        variantId,

        quantity,

        orderItemId

    }

    ===================================================
    */

    private async reserveAllocation(

        allocation: any,

        order: any,

        user: any,

        transaction: Transaction

    ) {

        /*
        Lock Inventory
        */

        const inventory: any =
            await this.inventoryRepo.findOneForUpdate(

                {

                    variantId:
                        allocation.variantId,

                    warehouseId:
                        allocation.warehouseId,

                    companyId:
                        order.companyId

                },

                transaction

            );

        if (!inventory) {

            throw new Error(

                `Inventory not found for Variant ${allocation.variantId}`

            );

        }

        /*
        Domain
        */

        const inventoryDomain =
            new InventorieDomain(inventory);

        inventoryDomain.reserveStock(
            allocation.quantity
        );

        /*
        Update Inventory
        */

        await this.inventoryRepo.update(

            inventory.id,

            {

                reserved:
                    inventoryDomain.reserved

            },

            transaction

        );

        /*
        Reservation
        */

        await this.reservationRepo.create(

            {

                inventoryId:
                    inventory.id,

                orderId:
                    order.id,

                variantId:
                    allocation.variantId,

                warehouseId:
                    allocation.warehouseId,

                companyId:
                    order.companyId,

                quantity:
                    allocation.quantity,

                status:
                    "ACTIVE",

                userId:
                    user.id,

                note:
                    "Stock Reserved"

            },

            transaction

        );

        /*
        Movement
        */

        await this.movementRepo.create(

            {

                companyId:
                    order.companyId,

                warehouseId:
                    allocation.warehouseId,

                variantId:
                    allocation.variantId,

                quantity:
                    allocation.quantity,

                type:
                    "RESERVE",

                referenceId:
                    order.id,

                userId:
                    user.id,

                note:
                    `Reserve Order ${order.id}`

            },

            transaction

        );

        /*
        Save Warehouse
        into OrderItem

        Ready for Split Fulfillment

        */

        await this.orderRepo.updateOrderItem(

            allocation.orderItemId,

            {

                warehouseId:
                    allocation.warehouseId

            },

            transaction

        );

    }

}