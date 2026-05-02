import { IWareHouseRepo } from "../../repo/WareHouseRepo/IWareHouseRepo";

export default class GetWareHouseUseCase {
  private _warehouseRepo: IWareHouseRepo;

  constructor(warehouseRepo: IWareHouseRepo) {
    this._warehouseRepo = warehouseRepo;
  }

  async execute(id: number, user: any): Promise<any> {
    try {
      //  1. Validate input
      if (!id || isNaN(id)) {
        throw new Error("Invalid warehouse id");
      }

      if (!user || !user.role) {
        throw new Error("Unauthorized");
      }

      //  2. Role check (defensive layer)
      const isAdmin = user.role === "ADMIN";
      const isOwner = user.role === "OWNER";

      if (!isAdmin && !isOwner) {
        throw new Error("Unauthorized role");
      }

      // 🏗️ 3. Call repository (all DB logic inside)
      const warehouse = await this._warehouseRepo.getWarehouseById(
        id,
        user
      );

      //  4. Not found or access denied
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }

      //  5. Normalize response (React-Admin friendly)
      return {
        ...warehouse,
        id: warehouse.id, // ensure stable id
      };

    } catch (error: any) {
      // clean error propagation
      throw new Error(error.message);
    }
  }
}