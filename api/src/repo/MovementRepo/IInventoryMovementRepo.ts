import { Transaction } from "sequelize";

export default interface IInventoryMovementRepo {
  create(data: any, transaction?: Transaction): Promise<any>;

  bulkCreate(data: any[], transaction?: Transaction): Promise<any>;

  findByVariant(
    variantId: number,
    warehouseId?: number
  ): Promise<any[]>;
}