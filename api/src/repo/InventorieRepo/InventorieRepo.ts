import { Transaction } from "sequelize";
import IInventorieRepo from "./IInventorieRepo";
import { Inventorie, Variant, Warehouse } from "../../models/main";
import QueryBuilder from "../../util/QuiryBuilder";





export default class InventorieRepo implements IInventorieRepo {
  async createInventorie(data: any, transaction?: Transaction): Promise<any> {
    try {
      const inventorie = await Inventorie.create(data, {
        transaction,
      });

      return inventorie;
    } catch (error) {
      throw error;
    }
  }

  async findAll(filterIds?: any): Promise<any[]> {
    try {
      const where: any = {};

      if (filterIds) {
        where.id = filterIds;
      }

      const inventories = await Inventorie.findAll({
        where,
      });

      return inventories;
    } catch (error) {
      throw error;
    }
  }

  // async findByVariantAndWarehouse(
  //   variantId: number,
  //   warehouseId: number,
  //   transaction?: Transaction
  // ): Promise<any> {
  //   try {
  //     const inventory = await Inventorie.findOne({
  //       where: {
  //         variantId: variantId,
  //         warehouseId: warehouseId,
          
  //       },
  //       transaction,
  //   lock: transaction?.LOCK.UPDATE, // 🔒 row lock
        
  //     });
  
  //     return inventory;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    transaction?: Transaction
  ): Promise<any> {
    try {
      const inventory = await Inventorie.findOne({
        where: {
          variantId,
          warehouseId,
        },
        include: [
          {
            model: Warehouse,
            as: 'warehouse' ,
            attributes: ["id", "name"],
          },
          {
            model: Variant,
            as: 'variant',
            attributes: ["id", "sku", "color","size"],
          },
        ],
        transaction,
        lock: transaction?.LOCK.UPDATE,
      });
  
      return inventory;
    } catch (error) {
      throw error;
    }
  }

  async updateInventorie(
    id: number,
    data: any,
    transaction?: Transaction
  ): Promise<any> {
    const inventory = await Inventorie.findByPk(id, { transaction });

    if (!inventory) return null;

    await inventory.update(data, { transaction });

    return inventory;
  }

  // INCREMENT STOCK (atomic)
  async incrementStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any> {
    await Inventorie.increment(
      { quantity },
      {
        where: { id },
        transaction,
      }
    );

    return await Inventorie.findByPk(id, { transaction });
  }

  // DECREMENT STOCK (safe)
  async decrementStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any> {
    await Inventorie.decrement(
      { quantity },
      {
        where: { id },
        transaction,
      }
    );

    return await Inventorie.findByPk(id, { transaction });
  }

  // UPSERT (fallback for race conditions)
  async upsertInventory(
    data: { variantId: number; warehouseId: number; quantity: number },
    transaction?: Transaction
  ): Promise<any> {
    const [inventory, created] = await Inventorie.findOrCreate({
      where: {
        variantId: data.variantId,
        warehouseId: data.warehouseId,
      },
      defaults: data,
      transaction,
      lock: transaction?.LOCK.UPDATE,
    });

    if (!created) {
      await inventory.increment("quantity", {
        by: data.quantity,
        transaction,
      });
    }

    return inventory;
  }

  // RESERVED STOCK
  async reserveStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any> {
    const inventory = await Inventorie.findByPk(id, { transaction });

    if (!inventory) throw new Error("Inventory not found");

    if (inventory.quantity - inventory.reserved < quantity) {
      throw new Error("Not enough available stock");
    }

    await inventory.increment("reserved", {
      by: quantity,
      transaction,
    });

    return await Inventorie.findByPk(id, { transaction });
  }

  //  RELEASE RESERVED STOCK
  async releaseReservedStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any> {
    await Inventorie.decrement(
      { reserved: quantity },
      {
        where: { id },
        transaction,
      }
    );

    return await Inventorie.findByPk(id, { transaction });
  }
  // async    findAllFiltredInventories(dataclean:any,notcleandata:any): Promise<any>
  // {
  //             try {
  //               const qb = new QueryBuilder(
  //                 {
  //                   ...dataclean,
  //                   filter: notcleandata.filter || dataclean.filter || {},
  //                 },
  //                 Inventorie
  //               )
  //                 .filter()
  //                 .sort()
  //                 .paginate();
            
  //               const options = qb.build();

  //               const { rows, count } = await Inventorie.findAndCountAll({
  //                 ...options,
            
     
  //           //       include: [
  //           //         {
  //           //           model: Warehouse,
  //           // as: "warehouse",//
  //           // attributes: ["id", "name"],
  //           //         },
  //           //         {
  //           //           model: Variant,
  //           //           as: "variant", // if exists
  //           //           attributes: ["id", "name", "sku"],
  //           //         },
  //           //       ],
  //           include: [
  //             {
  //               association: "warehouse",
  //               attributes: ["id", "name"],
  //             },
  //             {
  //               association: "variant",
  //     attributes: ["id", "sku", "color", "size", "price"],
  //     include: [
  //       {
  //         association: "product",
  //         attributes: ["id", "name"],
  //       },
  //     ],
  //             },
  //           ],
            
  //                 distinct: true,
  //               //  nest: true,
  //                 raw: false,
  //               });
            
  //               return {
  //                 data: rows,
  //                 total: count || 0,
  //               };
  //             } catch (error: any) {
  //               console.error("findAllFiltredInventories Repo Error:", error);
  //               throw new Error(error.message);
  //             }
  // }


  async findAllFiltredInventories(
    dataclean: any,
    notcleandata: any
  ): Promise<any> {
    try {

      console.log("dataaaaaaaaa  clean 1 ",dataclean ,"  not cleandata  ",notcleandata)
      const qb = new QueryBuilder(
        {
          ...dataclean,
          filter: notcleandata.filter || dataclean.filter || {},
        },
        Inventorie
      )
        .filter()
        .sort()
        .paginate();
  
      const options = qb.build();
  
      const { rows, count } = await Inventorie.findAndCountAll({
        ...options,
  
        include: [
          {
            association: "warehouse",
            attributes: ["id", "name"],
          },
          {
            association: "variant",
            attributes: ["id", "sku", "color", "size", "price"],
            include: [
              {
                association: "product",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
  
        distinct: true,
        subQuery: false, // 
      });
  
      return {
        data: rows.map((inv: any) => ({
          id: inv.id,
          quantity: inv.quantity,
          reserved: inv.reserved,
          available: inv.quantity - inv.reserved,
  
          warehouse: inv.warehouse,
  
          variant: inv.variant
            ? {
                ...inv.variant.toJSON(),
                product: inv.variant.product,
              }
            : null,
  
          createdAt: inv.createdAt,
          updatedAt: inv.updatedAt,
        })),
  
        total: count || 0,
      };
    } catch (error: any) {
      console.error("findAllFiltredInventories Repo Error:", error);
      throw new Error(error.message);
    }
  }
  async findById(id: number): Promise<any> {
    return await Inventorie.findByPk(id, {
      include: [
        { association: "warehouse" },
        { association: "variant", include: [{ association: "product" }] },
      ],
    });
  }
  /**
   async findByVariantAndWarehouse(
  variantId: number,
  warehouseId: number
) {
  return Inventory.findOne({
    where: { variantId, warehouseId },
    include: [
      { model: Variant },
      { model: Warehouse },
    ],
  });
}
   */
}
