import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class GetVariantProductUseCase {
  private _variantRepo: VariantProductRepo;

  constructor(variantRepo: VariantProductRepo) {
    this._variantRepo = variantRepo;
  }

  async execute(variantId: number): Promise<any> {
    try {
      if (!variantId) {
        throw new Error("variantId is required");
      }

      const variant = await this._variantRepo.getVariantById(variantId);

      return variant;
    } catch (error) {
      throw error;
    }
  }
}