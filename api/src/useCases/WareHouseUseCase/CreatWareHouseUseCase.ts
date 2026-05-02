import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";
import { IWareHouseRepo } from "../../repo/WareHouseRepo/IWareHouseRepo";

 interface CreateWarehouseDTO {
       name: string;
       location: string;
       companyId: number;
     }

export default class CreateWareHouseUseCase {
  private _warehouseRepo: IWareHouseRepo;
  private _companyRepo : ICompanyRepo
  constructor(warehouseRepo: IWareHouseRepo,companyRepo :ICompanyRepo) {
    this._warehouseRepo = warehouseRepo;
    this._companyRepo = companyRepo ;
  }

  async execute(data: CreateWarehouseDTO): Promise<any> {
    try {
      const company = await this._companyRepo.findById(data.companyId);

      console.log("cccc  \t ",company)
      if (!company) {
        throw new Error("Company not found");
      }

      const existing = await this._warehouseRepo.findByNameAndCompany(
        data.name,
        data.companyId
      );

      if (existing) {
        throw new Error("Warehouse already exists for this company");
      }

      const warehouse = await this._warehouseRepo.create(data);

      return warehouse;
    } catch (error:any) {
      console.error("CreateWareHouseUseCase Error:", error);
      throw error;
    }
  }
}