import { Transaction } from "sequelize";

import IInventoryMovementRepo from "./IInventoryMovementRepo";
import { InventoryMovement } from "../../models/main";

export default class InventoryMovementRepo
  implements IInventoryMovementRepo
{
  async create(data: any, transaction?: Transaction): Promise<any> {
    return await InventoryMovement.create(data, { transaction });
  }

  // async bulkCreate(data: any[], transaction?: Transaction): Promise<any[]> {

  //   console.log("************** //////  ",data)
  //   const result :any = await InventoryMovement.bulkCreate(data, { transaction });
  //   console.log("rrrrrrrrrrrrrr  ",result)
  //   return await InventoryMovement.bulkCreate(data, { transaction });
  // }
  
  async bulkCreate(
    data: any[],
    transaction?: Transaction
  ): Promise<any[]> {
  
    try {
  
      console.log("InventoryMovement =", InventoryMovement);
      console.log("options =", (InventoryMovement as any).options);
      console.log("sequelize =", (InventoryMovement as any).sequelize);


      console.log("************** ////// ", data);
  
      const result = await InventoryMovement.bulkCreate(
        data,
        { transaction }
      );
  
      console.log("rrrrrrrrrrrrrr ", result);
  
      return result;
  
    } catch (error) {
  
      console.error("InventoryMovement.bulkCreate ERROR");
      console.error(error);
  
      throw error;
    }
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