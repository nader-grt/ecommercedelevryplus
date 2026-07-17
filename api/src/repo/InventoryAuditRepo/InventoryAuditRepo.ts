import { Transaction } from "sequelize";
import { InventoryAudit } from "../../models/main";
import QueryBuilder from "../../util/QuiryBuilder";
import IInventoryAuditRepo from "./IInventoryAuditRepo";

export default class InventoryAuditRepo
  implements IInventoryAuditRepo
{
  async create(
    data: any,
    transaction?: Transaction
  ): Promise<any> {
    return await InventoryAudit.create(data, { transaction });
  }

  async bulkCreate(
    data: any[],
    transaction?: Transaction
  ): Promise<any[]> {
    return await InventoryAudit.bulkCreate(data, {
      transaction,
    });
  }

  async findById(
    id: number,
    transaction?: Transaction
  ): Promise<any | null> {
    return await InventoryAudit.findByPk(id, {
      transaction,
    });
  }

  async findByVariant(
    variantId: number,
    warehouseId?: number,
    transaction?: Transaction
  ): Promise<any[]> {
    const where: any = { variantId };

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    return await InventoryAudit.findAll({
      where,
      order: [["createdAt", "DESC"]],
      transaction,
    });
  }

  async findAll(query: any): Promise<any> {
    const qb = new QueryBuilder(query, InventoryAudit)
      .filter()
      .sort()
      .paginate();

    const options = qb.build();

    const { rows, count } = await InventoryAudit.findAndCountAll({
      ...options,
      distinct: true,
      subQuery: false,
    });

    return {
      data: rows,
      total: count,
    };
  }

  async findLatestByVariant(
    variantId: number,
    warehouseId: number
  ): Promise<any | null> {
    return await InventoryAudit.findOne({
      where: {
        variantId,
        warehouseId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async delete(
    id: number,
    transaction?: Transaction
  ): Promise<void> {
    const audit = await InventoryAudit.findByPk(id, {
      transaction,
    });

    if (!audit) {
      throw new Error("Inventory audit not found");
    }

    await audit.destroy({
      transaction,
    });
  }
}