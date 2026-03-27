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
 
  //  const result:any = await this._warehouseRepo.findAll(dto, notFiltered);
    const resultTest:any = await this._warehouseRepo.findAllFiltredByName(dto, notFiltered);

    console.log("object ********** ",resultTest)
    if (!resultTest || resultTest.data.length === 0) {
        return {
          success: false,
          message: "No warehouses found",
          data: [],
          total: 0,
        };
      }

      return {
        success: true,
        message: "Warehouses found",
        data: resultTest.data, //    
        total: resultTest.total, // 
      };

    } catch (error) {
      console.error("ListWareHousesUseCase Error:", error);
      throw error;
    }
  }
}