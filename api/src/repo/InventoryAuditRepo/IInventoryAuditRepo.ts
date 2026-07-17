import { Transaction } from "sequelize";

export default interface IInventoryAuditRepo {
  create(data: any, transaction?: Transaction): Promise<any>;

  bulkCreate(
    data: any[],
    transaction?: Transaction
  ): Promise<any[]>;

  findById(
    id: number,
    transaction?: Transaction
  ): Promise<any | null>;

  findByVariant(
    variantId: number,
    warehouseId?: number,
    transaction?: Transaction
  ): Promise<any[]>;

  findAll(query: any): Promise<any>;

  findLatestByVariant(
    variantId: number,
    warehouseId: number
  ): Promise<any | null>;

  delete(
    id: number,
    transaction?: Transaction
  ): Promise<void>;
}