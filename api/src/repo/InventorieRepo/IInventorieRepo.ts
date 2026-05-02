import { Transaction } from "sequelize";

export default interface IInventorieRepo {
  create(data: any, transaction?: Transaction): Promise<any>;

  findById(id: number, transaction?: Transaction): Promise<any | null>;

  findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    transaction?: Transaction
  ): Promise<any | null>;

  update(
    id: number,
    data: Partial<{
      quantity: number;
      reserved: number;
    }>,
    transaction?: Transaction
  ): Promise<any>;

  findAllFiltered(query: any): Promise<{
    data: any[];
    total: number;
  }>;
}