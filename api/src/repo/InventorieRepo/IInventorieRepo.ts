import { Transaction } from "sequelize";

export default interface IInventorieRepo {
  createInventorie(data: any, transaction?: Transaction): Promise<any>;

  findAll(filterIds?: any): Promise<any[]>;

  findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    transaction?: Transaction
  ): Promise<any>;
   findAllFiltredInventories(dataclean:any,notcleandata:any): Promise<any[]>;

    findById(id: number): Promise<any> ;
  //  UPDATE
  updateInventorie(
    id: number,
    data: any,
    transaction?: Transaction
  ): Promise<any>;

  incrementStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any>;

  decrementStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any>;

  upsertInventory(
    data: {
      variantId: number;
      warehouseId: number;
      quantity: number;
    },
    transaction?: Transaction
  ): Promise<any>;

  reserveStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any>;

  releaseReservedStock(
    id: number,
    quantity: number,
    transaction?: Transaction
  ): Promise<any>;
}
