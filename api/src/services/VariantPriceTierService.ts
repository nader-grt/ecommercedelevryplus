import VariantPriceTierRepo from "../repo/VariantPriceTierRepo/VariantPriceTierRepo";

export default class VariantPriceTierService {

  private repo: VariantPriceTierRepo;

  constructor() {
    this.repo = new VariantPriceTierRepo();
  }

  /* =========================
     CREATE
  ========================= */
  async CreateVariantPriceTier(data: {
    variantId: number;
    minQty: number;
    price: number;
  }) {

    if (data.minQty <= 0) {
      throw new Error("minQty must be > 0");
    }

    if (data.price <= 0) {
      throw new Error("price must be > 0");
    }

    const existing = await this.repo.findDuplicate(
      data.variantId,
      data.minQty
    );

    if (existing) {
      throw new Error("Tier already exists");
    }

    return await this.repo.create(data);
  }

  /* ========================= */
  async GetVariantPriceTier(variantId: number) {
    return await this.repo.findByVariantId(variantId);
  }

  /* ========================= */
  async UpdateVariantPriceTier(id: number, data: any) {

    if (data.minQty && data.minQty <= 0) {
      throw new Error("minQty must be > 0");
    }

    if (data.price && data.price <= 0) {
      throw new Error("price must be > 0");
    }

    const updated = await this.repo.update(id, data);

    if (!updated) {
      throw new Error("Tier not found");
    }

    return updated;
  }

  /* ========================= */
  async DeleteVariantPriceTier(id: number) {

    const deleted = await this.repo.delete(id);

    if (!deleted) {
      throw new Error("Tier not found");
    }

    return { message: "Deleted successfully" };
  }

  /* ========================= */
  async GetAllVariantPriceTier() {
    return await this.repo.findAll();
  }

  /* =========================
     🔥 PRICE LOGIC
  ========================= */
  async resolvePrice(variantId: number, quantity: number): Promise<number> {

    const tiers = await this.repo.findByVariantIdDesc(variantId);

    for (const tier of tiers) {
      if (quantity >= tier.minQty) {
        return Number(tier.price);
      }
    }

    throw new Error("No pricing tier found");
  }
}