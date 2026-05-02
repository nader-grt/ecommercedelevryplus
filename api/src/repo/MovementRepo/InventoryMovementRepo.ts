import { Transaction } from "sequelize";
import { InventoryMovement } from "../../models/InventoryMovement";
import IInventoryMovementRepo from "./IInventoryMovementRepo";

export default class InventoryMovementRepo
  implements IInventoryMovementRepo
{
  async create(data: any, transaction?: Transaction): Promise<any> {
    return await InventoryMovement.create(data, { transaction });
  }

  async bulkCreate(data: any[], transaction?: Transaction): Promise<any[]> {
    return await InventoryMovement.bulkCreate(data, { transaction });
  }

  async findByVariant(
    variantId: number,
    warehouseId?: number
  ): Promise<any[]> {
    const where: any = { variantId };

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    return await InventoryMovement.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
  }
}