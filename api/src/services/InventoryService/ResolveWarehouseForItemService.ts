import { Transaction } from "sequelize";
import { Inventorie, Warehouse } from "../../models/main";

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

export default class ResolveWarehouseForItemService {

    public async executeService(

        companyId: number,

        items: OrderItemInput[],

        transaction: Transaction

    ): Promise<Allocation[]> {

        const warehouses = await Warehouse.findAll({

            where: {

                companyId

            },

            transaction

        });

        if (warehouses.length === 0) {

            throw new Error(

                `No warehouse found for company ${companyId}`

            );

        }

        /*
        =======================================================
        Current Strategy

        One warehouse must satisfy all items.

        Future:
            Split Fulfillment

        =======================================================
        */

        for (const warehouse of warehouses) {

            const canFulfill = await this.canWarehouseFulfillAll(

                warehouse.id,

                companyId,

                items,

                transaction

            );

            if (canFulfill) {

                return items.map(item => ({

                    orderItemId: item.orderItemId,

                    warehouseId: warehouse.id,

                    variantId: item.variantId,

                    quantity: item.quantity

                }));

            }

        }

        throw new Error(

            "No warehouse can fulfill this order."

        );

    }

    /*
    =======================================================

    Check Warehouse Stock

    =======================================================
    */

    private async canWarehouseFulfillAll(

        warehouseId: number,

        companyId: number,

        items: OrderItemInput[],

        transaction: Transaction

    ): Promise<boolean> {

        for (const item of items) {

            const inventory: any = await Inventorie.findOne({

                where: {

                    warehouseId,

                    companyId,

                    variantId: item.variantId

                },

                transaction

            });

            if (!inventory) {

                return false;

            }

            const available =

                inventory.quantity -

                inventory.reserved;

            if (available < item.quantity) {

                return false;

            }

        }

        return true;

    }

}