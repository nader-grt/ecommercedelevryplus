import { IWareHouseRepo } from "../../repo/WareHouseRepo/IWareHouseRepo";

interface ListWarehouseDTO {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
}

export default class ListWareHousesUseCase {
  private _warehouseRepo: IWareHouseRepo;

  constructor(warehouseRepo: IWareHouseRepo) {
    this._warehouseRepo = warehouseRepo;
  }

  async execute(dto: ListWarehouseDTO, notFiltered?: any): Promise<any> {
    try {
 
    const result = await this._warehouseRepo.findAll(dto, notFiltered);

    // if (result.data.length === 0) {
    //     return {
    //       success: false,
    //       message: "No warehouses found",
    //       data: [],
    //       total: 0,
    //     };
    //   }

      return {
        success: true,
        message: "Warehouses found",
        // data: result.data,
        // total: result.total,
      };

    } catch (error) {
      console.error("ListWareHousesUseCase Error:", error);
      throw error;
    }
  }
}