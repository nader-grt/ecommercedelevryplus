

























import { Transaction } from "sequelize";
import IInventorieRepo, {
  ICreateInventoryParams,
  IFindInventoryParams
} from "./IInventorieRepo";

import { Inventorie, sequelize } from "../../models/main";
import QueryBuilder from "../../util/QuiryBuilder";

export default class InventorieRepo implements IInventorieRepo {

  // ============================================================
  // FIND WAREHOUSES BY PRIORITY
  // ============================================================

  async findWarehousesByPriority(
    companyId: number,
    transaction?: Transaction
  ): Promise<any[]> {

    const inventories = await Inventorie.findAll({
      where: {
        companyId
      },

      include: [
        {
          association: "warehouse",
          attributes: [
            "id",
            "name",
            "priority",
            "lat",
            "lng"
          ]
        }
      ],

      order: [
        // [
        //   { association: "warehouse" },
        //   "priority",
        //   "ASC"
        // ]
      ],

      transaction
    });

    const warehouses = new Map<number, any>();

    for (const inventory of inventories as any[]) {

      const warehouse = inventory.warehouse;

      if (
        warehouse &&
        !warehouses.has(warehouse.id)
      ) {
        warehouses.set(
          warehouse.id,
          warehouse
        );
      }
    }

    return Array.from(
      warehouses.values()
    );
  }


  // ============================================================
  // UPDATE RESERVED
  // ============================================================

  async updateReserved(
    inventoryId: number,
    newReserved: number,
    transaction: Transaction
  ): Promise<any> {

    if (
      !Number.isFinite(newReserved) ||
      newReserved < 0
    ) {
      throw new Error(
        "Invalid reserved quantity"
      );
    }

    const inventory =
      await Inventorie.findByPk(
        inventoryId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!inventory) {
      throw new Error(
        `Inventory ${inventoryId} not found`
      );
    }

    if (
      newReserved > inventory.quantity
    ) {
      throw new Error(
        "Reserved quantity cannot exceed inventory quantity"
      );
    }

    inventory.reserved =
      newReserved;

    await inventory.save({
      transaction
    });

    return inventory;
  }


  // ============================================================
  // FIND WAREHOUSE IDS BY COMPANY
  // ============================================================

  async findWarehouseIdsByCompany(
    companyId: number,
    transaction?: Transaction
  ): Promise<number[]> {

    const inventories =
      await Inventorie.findAll({
        where: {
          companyId
        },

        attributes: [
          "warehouseId"
        ],

        group: [
          "warehouseId"
        ],

        transaction,

        raw: true
      });

    return inventories.map(
      (inventory: any) =>
        inventory.warehouseId
    );
  }


  // ============================================================
  // CREATE
  // ============================================================

  async create(
    data: any,
    transaction?: Transaction
  ): Promise<any> {

    console.log(
      "CREATE INVENTORY DATA:"
    );

    console.log(data);

    return await Inventorie.create(
      data,
      {
        transaction
      }
    );
  }


  // ============================================================
  // FIND BY ID
  // ============================================================

  async findById(
    id: number,
    transaction?: Transaction
  ): Promise<any | null> {

    return await Inventorie.findByPk(
      id,
      {
        include: [
          {
            association: "warehouse",
            attributes: [
              "id",
              "name"
            ]
          },

          {
            association: "variant",
            attributes: [
              "id",
              "sku",
              "color",
              "size",
              "price"
            ],

            include: [
              {
                association: "product",
                attributes: [
                  "id",
                  "name",
                  "companyId"
                ]
              }
            ]
          }
        ],

        transaction
      }
    );
  }


  // ============================================================
  // FIND BY VARIANT + WAREHOUSE
  //
  // FIX:
  // companyId MUST be included in WHERE.
  //
  // Also keeps FOR UPDATE when transaction exists.
  // ============================================================

  async findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    companyId?: number,
    transaction?: Transaction
  ): Promise<any | null> {

    const where: any = {
      variantId,
      warehouseId
    };


    console.log("repo find inventory is \t ",{    variantId ,
      warehouseId,
      companyId})
    /*
     * IMPORTANT:
     *
     * If companyId is supplied,
     * it MUST participate in the query.
     *
     * This prevents cross-company inventory access.
     */
    if (companyId !== undefined) {
      where.companyId = companyId;
    }

    return await Inventorie.findOne({
      where,

      transaction,

      /*
       * FOR UPDATE only makes sense
       * inside a transaction.
       */
      ...(transaction
        ? {
            lock: transaction.LOCK.UPDATE
          }
        : {})
    });
  }


  // ============================================================
  // UPDATE
  // ============================================================

  async update(
    id: number,
    data: {
      quantity?: number;
      reserved?: number;
    },
    transaction?: Transaction
  ) {

    const inventory =
      await Inventorie.findByPk(
        id,
        {
          transaction,

          /*
           * If transaction exists,
           * lock the row before changing it.
           */
          ...(transaction
            ? {
                lock: transaction.LOCK.UPDATE
              }
            : {})
        }
      );

    if (!inventory) {
      throw new Error(
        "Inventory not found"
      );
    }

    return inventory.update(
      data,
      {
        transaction
      }
    );
  }


  // ============================================================
  // FIND ALL FILTERED
  // ============================================================

  async findAllFiltered(
    query: any
  ): Promise<any> {

    const qb =
      new QueryBuilder(
        query,
        Inventorie
      )
        .filter()
        .sort()
        .paginate();

    const options =
      qb.build();

    const {
      rows,
      count
    } =
      await Inventorie.findAndCountAll({

        ...options,

        include: [
          {
            association: "warehouse",
            attributes: [
              "id",
              "name"
            ]
          },

          {
            association: "variant",
            attributes: [
              "id",
              "sku",
              "color",
              "size",
              "price"
            ],

            include: [
              {
                association: "product",
                attributes: [
                  "id",
                  "name",
                  "companyId"
                ]
              }
            ]
          }
        ],

        distinct: true,

        subQuery: false
      });

    return {
      data: rows.map(
        (inv: any) => ({
          id: inv.id,

          quantity:
            inv.quantity,

          reserved:
            inv.reserved,

          available:
            inv.quantity -
            inv.reserved,

          warehouse:
            inv.warehouse,

          variant:
            inv.variant,

          companyId:
            inv.companyId
        })
      ),

      total: count
    };
  }


  // ============================================================
  // FIND ONE FOR UPDATE
  //
  // Already correct.
  // Keep it because it is part of your repository contract.
  // ============================================================

  async findOneForUpdate(
    params: IFindInventoryParams,
    transaction: Transaction
  ) {

    return Inventorie.findOne({
      where: {
        variantId:
          params.variantId,

        warehouseId:
          params.warehouseId,

        companyId:
          params.companyId
      },

      transaction,

      lock:
        transaction.LOCK.UPDATE
    });
  }


  // ============================================================
  // UPDATE QUANTITY
  // ============================================================

  async updateQuantity(
    inventory: any,
    newQuantity: number,
    t: Transaction
  ) {

    if (
      !Number.isFinite(newQuantity) ||
      newQuantity < 0
    ) {
      throw new Error(
        "Invalid inventory quantity"
      );
    }

    inventory.quantity =
      newQuantity;

    return inventory.save({
      transaction: t
    });
  }


  // ============================================================
  // FIND FOR UPDATE
  //
  // This is the main method I recommend
  // for ReserveStockUseCase.
  // ============================================================

  async findForUpdate(
    variantId: number,
    warehouseId: number,
    companyId: number,
    transaction: Transaction
  ) {

    return Inventorie.findOne({
      where: {
        variantId,
        warehouseId,
        companyId
      },

      transaction,

      lock:
        transaction.LOCK.UPDATE
    });
  }


  // ============================================================
  // FIND WAREHOUSES WITH LOCATION
  // ============================================================

  async findWarehousesWithLocation(
    companyId: number,
    transaction?: Transaction
  ) {

    const inventories =
      await Inventorie.findAll({

        where: {
          companyId
        },

        include: [
          {
            association: "warehouse",

            attributes: [
              "id",
              "name",
              "lat",
              "lng"
            ]
          }
        ],

        transaction
      });

    const warehouses =
      new Map<number, any>();

    for (
      const inventory
      of inventories as any[]
    ) {

      const warehouse =
        inventory.warehouse;

      if (
        warehouse &&
        !warehouses.has(
          warehouse.id
        )
      ) {

        warehouses.set(
          warehouse.id,
          warehouse
        );
      }
    }

    return Array.from(
      warehouses.values()
    );
  }
}

































































// import { Transaction } from "sequelize";
// import IInventorieRepo, { ICreateInventoryParams, IFindInventoryParams } from "./IInventorieRepo";
// import { Inventorie, sequelize } from "../../models/main";
// import QueryBuilder from "../../util/QuiryBuilder";

// export default class InventorieRepo implements IInventorieRepo {

//   async findWarehousesByPriority(
//     companyId: number,
//     transaction?: Transaction
// ): Promise<any[]> {
//     const inventories = await Inventorie.findAll({
//         where: {
//             companyId
//         },
//         include: [
//             {
//                 association: "warehouse",
//                 attributes: [
//                     "id",
//                     "name",
//                     "priority",
//                     "lat",
//                     "lng"
//                 ]
//             }
//         ],
//         order: [
//          //   [{ association: "warehouse" }, "priority", "ASC"]
//         ],
//         transaction
//     });

//     const warehouses = new Map<number, any>();

//     for (const inventory of inventories as any[]) {
//         const warehouse = inventory.warehouse;

//         if (
//             warehouse &&
//             !warehouses.has(warehouse.id)
//         ) {
//             warehouses.set(warehouse.id, warehouse);
//         }
//     }

//     return Array.from(warehouses.values());
// }

// async updateReserved(
//   inventoryId: number,
//   newReserved: number,
//   transaction: Transaction
// ): Promise<any> {

//   if (!Number.isFinite(newReserved) || newReserved < 0) {
//     throw new Error("Invalid reserved quantity");
//   }

//   const inventory = await Inventorie.findByPk(
//     inventoryId,
//     {
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     }
//   );

//   if (!inventory) {
//     throw new Error(
//       `Inventory ${inventoryId} not found`
//     );
//   }

//   if (newReserved > inventory.quantity) {
//     throw new Error(
//       `Reserved quantity cannot exceed inventory quantity`
//     );
//   }

//   inventory.reserved = newReserved;

//   await inventory.save({
//     transaction,
//   });

//   return inventory;
// }

// async findWarehouseIdsByCompany(
//   companyId: number,
//   transaction?: Transaction
// ): Promise<number[]> {
//   const inventories = await Inventorie.findAll({
//       where: {
//           companyId
//       },
//       attributes: ["warehouseId"],
//       group: ["warehouseId"],
//       transaction,
//       raw: true
//   });

//   return inventories.map(
//       (inventory: any) => inventory.warehouseId
//   );
// }




//   async create(data: any, transaction?: Transaction): Promise<any> {
//     console.log("CREATE INVENTORY DATA:");
//     console.log(data);
  
//     return await Inventorie.create(data, { transaction });
//   }


//   async findById(id: number, transaction?: Transaction): Promise<any | null> {
//     return await Inventorie.findByPk(id, {
//       include: [
//         { association: "warehouse", attributes: ["id", "name"] },
//         {
//           association: "variant",
//           attributes: ["id", "sku", "color", "size", "price"],
//           include: [{ association: "product", attributes: ["id", "name","companyId"] }],
//         },
//       ],
//       transaction,
//     });
//   }

//   async findByVariantAndWarehouse(
//     variantId: number,
//     warehouseId: number,
//     companyId?: number,
  
//     transaction?: Transaction
//   ): Promise<any | null> {
//     return await Inventorie.findOne({
//       where: { variantId, warehouseId },
//       transaction,
//       lock: transaction?.LOCK.UPDATE,
//     });
//   }

//   // async update(
//   //   id: number,
//   //   data: { quantity?: number; reserved?: number },
//   //   transaction?: Transaction
//   // ): Promise<any> {
//   //   const inventory = await Inventorie.findByPk(id, { transaction });

//   //   if (!inventory) {
//   //     throw new Error("Inventory not found");
//   //   }

//   //   return await inventory.update(data, { transaction });
//   // }

//   async update(
//     id:number,
//     data:{
//       quantity?:number;
//       reserved?:number
//     },
//     transaction?:Transaction
// ){

//  const inventory = await Inventorie.findByPk(
//     id,
//     {
//       transaction,
//       lock: transaction?.LOCK.UPDATE
//     }
//  );


//  if(!inventory){
//    throw new Error("Inventory not found");
//  }


//  return inventory.update(
//     data,
//     {
//       transaction
//     }
//  );

// }

//   async findAllFiltered(query: any): Promise<any> {
//     const qb = new QueryBuilder(query, Inventorie)
//       .filter()
//       .sort()
//       .paginate();

//     const options = qb.build();

//     const { rows, count } = await Inventorie.findAndCountAll({
//       ...options,
//       include: [
//         { association: "warehouse", attributes: ["id", "name"] },
//         {
//           association: "variant",
//           attributes: ["id", "sku", "color", "size", "price"],
//           include: [{ association: "product", attributes: ["id", "name","companyId"] }],
//         },
//       ],
//       distinct: true,
//       subQuery: false,
//     });

//     return {
//       data: rows.map((inv: any) => ({
//         id: inv.id,
//         quantity: inv.quantity,
//         reserved: inv.reserved,
//         available: inv.quantity - inv.reserved,
//         warehouse: inv.warehouse,
//         variant: inv.variant,
//         companyId:inv.companyId
//       })),
//       total: count,
//     };
//   }

//   async findOneForUpdate(
//     params: IFindInventoryParams,
//     transaction: Transaction
// ) {

//     return Inventorie.findOne({
//         where:{
//             variantId: params.variantId,
//             warehouseId: params.warehouseId,
//             companyId: params.companyId
//         },
//         transaction,
//         lock: transaction.LOCK.UPDATE
//     });

// }

//   async updateQuantity(inventory: any, newQuantity: number, t: any) {
//     inventory.quantity = newQuantity;
//     return inventory.save({ transaction: t });
//   }

//   async findForUpdate(
//     variantId: number,
//     warehouseId: number,
//     companyId: number,
//     transaction: Transaction
// ) {
//     return Inventorie.findOne({
//         where: {
//             variantId,
//             warehouseId,
//             companyId
//         },
//         transaction,
//         lock: transaction.LOCK.UPDATE
//     });
// }

//   async findWarehousesWithLocation(
//     companyId: number,
//     transaction?: Transaction
// ) {
//     const inventories = await Inventorie.findAll({
//         where: {
//             companyId
//         },
//         include: [
//             {
//                 association: "warehouse",
//                 attributes: [
//                     "id",
//                     "name",
//                     "lat",
//                     "lng"
//                 ]
//             }
//         ],
//         transaction
//     });

//     const warehouses = new Map<number, any>();

//     for (const inventory of inventories as any[]) {
//         const warehouse = inventory.warehouse;

//         if (
//             warehouse &&
//             !warehouses.has(warehouse.id)
//         ) {
//             warehouses.set(warehouse.id, warehouse);
//         }
//     }

//     return Array.from(warehouses.values());
// }
// }