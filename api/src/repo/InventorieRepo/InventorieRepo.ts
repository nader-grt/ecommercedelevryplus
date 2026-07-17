import { Transaction } from "sequelize";
import IInventorieRepo, { ICreateInventoryParams, IFindInventoryParams } from "./IInventorieRepo";
import { Inventorie, sequelize } from "../../models/main";
import QueryBuilder from "../../util/QuiryBuilder";

export default class InventorieRepo implements IInventorieRepo {

  async create(data: any, transaction?: Transaction): Promise<any> {
    console.log("CREATE INVENTORY DATA:");
    console.log(data);
  
    return await Inventorie.create(data, { transaction });
  }


  async findById(id: number, transaction?: Transaction): Promise<any | null> {
    return await Inventorie.findByPk(id, {
      include: [
        { association: "warehouse", attributes: ["id", "name"] },
        {
          association: "variant",
          attributes: ["id", "sku", "color", "size", "price"],
          include: [{ association: "product", attributes: ["id", "name","companyId"] }],
        },
      ],
      transaction,
    });
  }

  async findByVariantAndWarehouse(
    variantId: number,
    warehouseId: number,
    transaction?: Transaction
  ): Promise<any | null> {
    return await Inventorie.findOne({
      where: { variantId, warehouseId },
      transaction,
      lock: transaction?.LOCK.UPDATE,
    });
  }

  // async update(
  //   id: number,
  //   data: { quantity?: number; reserved?: number },
  //   transaction?: Transaction
  // ): Promise<any> {
  //   const inventory = await Inventorie.findByPk(id, { transaction });

  //   if (!inventory) {
  //     throw new Error("Inventory not found");
  //   }

  //   return await inventory.update(data, { transaction });
  // }

  async update(
    id:number,
    data:{
      quantity?:number;
      reserved?:number
    },
    transaction?:Transaction
){

 const inventory = await Inventorie.findByPk(
    id,
    {
      transaction,
      lock: transaction?.LOCK.UPDATE
    }
 );


 if(!inventory){
   throw new Error("Inventory not found");
 }


 return inventory.update(
    data,
    {
      transaction
    }
 );

}

  async findAllFiltered(query: any): Promise<any> {
    const qb = new QueryBuilder(query, Inventorie)
      .filter()
      .sort()
      .paginate();

    const options = qb.build();

    const { rows, count } = await Inventorie.findAndCountAll({
      ...options,
      include: [
        { association: "warehouse", attributes: ["id", "name"] },
        {
          association: "variant",
          attributes: ["id", "sku", "color", "size", "price"],
          include: [{ association: "product", attributes: ["id", "name","companyId"] }],
        },
      ],
      distinct: true,
      subQuery: false,
    });

    return {
      data: rows.map((inv: any) => ({
        id: inv.id,
        quantity: inv.quantity,
        reserved: inv.reserved,
        available: inv.quantity - inv.reserved,
        warehouse: inv.warehouse,
        variant: inv.variant,
        companyId:inv.companyId
      })),
      total: count,
    };
  }

  async findOneForUpdate(
    params: IFindInventoryParams,
    transaction: Transaction
) {

    return Inventorie.findOne({
        where:{
            variantId: params.variantId,
            warehouseId: params.warehouseId,
            companyId: params.companyId
        },
        transaction,
        lock: transaction.LOCK.UPDATE
    });

}

  async updateQuantity(inventory: any, newQuantity: number, t: any) {
    inventory.quantity = newQuantity;
    return inventory.save({ transaction: t });
  }
}