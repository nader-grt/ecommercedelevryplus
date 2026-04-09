import { VariantPriceTier } from "../../models/main";
import IVariantPriceTierRepo from "./IVariantPriceTierRepo";

export default class VariantPriceTierRepo extends IVariantPriceTierRepo {

  async create(data: any): Promise<any> {
    return await VariantPriceTier.create(data);
  }

  async findByVariantId(variantId: number): Promise<any[]> {
    return await VariantPriceTier.findAll({
      where: { variantId },
      order: [["minQty", "ASC"]],
    });
  }

  async findByVariantIdDesc(variantId: number): Promise<any[]> {
    return await VariantPriceTier.findAll({
      where: { variantId },
      order: [["minQty", "DESC"]],
    });
  }

  async findById(id: number): Promise<any> {
    return await VariantPriceTier.findByPk(id);
  }

  async findDuplicate(variantId: number, minQty: number): Promise<any> {
    return await VariantPriceTier.findOne({
      where: { variantId, minQty },
    });
  }

  async update(id: number, data: any): Promise<any> {
    const tier = await VariantPriceTier.findByPk(id);
    if (!tier) return null;
    return await tier.update(data);
  }

  async delete(id: number): Promise<any> {
    const tier = await VariantPriceTier.findByPk(id);
    if (!tier) return null;
    await tier.destroy();
    return true;
  }

  async findAll(): Promise<any[]> {
    return await VariantPriceTier.findAll({
      order: [["variantId", "ASC"]],
    });
  }
}