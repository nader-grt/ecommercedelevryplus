import { Transaction } from "sequelize";


export interface IFindInventoryParams {
  variantId: number;
  warehouseId: number;
  companyId: number;
}

export interface ICreateInventoryParams {
  variantId: string | any;
  warehouseId: string | any;
  quantity: number;
}

export interface ICreateMovementParams {
  variantId: string;
  warehouseId: string;
  type: "stock_in" | "stock_out" | "adjustment" | "transfer";
  quantityChange: number;
  resultingQuantity: number;
  performedBy: string;
}


export default interface IInventorieRepo {
  create(data: any, transaction?: Transaction): Promise<any>;
  findWarehousesWithLocation( companyId: number,transaction?: Transaction):Promise<any | null>;
  updateReserved(
    inventoryId: number,
    newReserved: number,
    transaction: Transaction
  ): Promise<any>;
  
  findWarehouseIdsByCompany(
    companyId: number,
    transaction?: Transaction
  ): Promise<number[]> 
  findById(id: number, transaction?: Transaction): Promise<any | null>;

  findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    companyId?: number,
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
  findWarehousesByPriority(
    companyId: number,
    transaction?: Transaction
): Promise<any[]>

  findOneForUpdate(params: IFindInventoryParams, t?: any): Promise<any | null>;

  updateQuantity(inventory: any, newQuantity: number, t: any): Promise<any>;
  findForUpdate(
    variantId: number,
    warehouseId: number,
    companyId: number,
    transaction: Transaction
) : Promise<any>;
 // create2(params: ICreateInventoryParams): Promise<any>;
}