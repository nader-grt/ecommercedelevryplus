import { Transaction } from "sequelize";
import IInventorieRepo from "./IInventorieRepo";
import { Inventorie } from "../../models/main";
import QueryBuilder from "../../util/QuiryBuilder";

export default class InventorieRepo implements IInventorieRepo {

  async create(data: any, transaction?: Transaction): Promise<any> {
    return await Inventorie.create(data, { transaction });
  }

  async findById(id: number, transaction?: Transaction): Promise<any | null> {
    return await Inventorie.findByPk(id, {
      include: [
        { association: "warehouse", attributes: ["id", "name"] },
        {
          association: "variant",
          attributes: ["id", "sku", "color", "size", "price"],
          include: [{ association: "product", attributes: ["id", "name"] }],
        },
      ],
      transaction,
    });
  }

  async findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    transaction?: Transaction
  ): Promise<any | null> {
    return await Inventorie.findOne({
      where: { variantId, warehouseId },
      transaction,
      lock: transaction?.LOCK.UPDATE,
    });
  }

  async update(
    id: number,
    data: { quantity?: number; reserved?: number },
    transaction?: Transaction
  ): Promise<any> {
    const inventory = await Inventorie.findByPk(id, { transaction });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    return await inventory.update(data, { transaction });
  }

  async findAllFiltered(query: any): Promise<any> {
    const qb = new QueryBuilder(query, Inventorie)
      .filter()
      .sort()
      .paginate();

    const options = qb.build();

    const { rows, count } = await Inventorie.findAndCountAll({
      ...options,
      include: [
        { association: "warehouse", attributes: ["id", "name"] },
        {
          association: "variant",
          attributes: ["id", "sku", "color", "size", "price"],
          include: [{ association: "product", attributes: ["id", "name"] }],
        },
      ],
      distinct: true,
      subQuery: false,
    });

    return {
      data: rows.map((inv: any) => ({
        id: inv.id,
        quantity: inv.quantity,
        reserved: inv.reserved,
        available: inv.quantity - inv.reserved,
        warehouse: inv.warehouse,
        variant: inv.variant,
      })),
      total: count,
    };
  }
}