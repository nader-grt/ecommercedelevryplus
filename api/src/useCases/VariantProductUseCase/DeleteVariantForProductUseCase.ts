import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class DeleteVariantForProductUseCase {
  private _repo!: VariantProductRepo;
  constructor(repo: VariantProductRepo) {
    this._repo = repo;
  }

  async execute(id: number): Promise<any> {
    try {
      // 1. get variant

      console.log("delete variants  id ",id)
      const variant = await this._repo.getVariantById(id);

      console.log(" variants  ",variant)
      if (!variant) throw new Error("Variant not found");

      const productId = variant.productId;

      // 2. check if used in orders
       const used = await this._repo.isVariantUsed(id);

      if (used) {
        throw new Error("Cannot delete variant used in orders");
      }

      // await this.repo.softDelete(id);

      //  4. count remaining variants
      await this._repo.deleteVariant(id);

    const count = await this._repo.countByProduct(productId);

    if (count === 0) {
      await this._repo.convertProductToSimple(productId);
    }

      return {
        message: "Variant deleted successfully",
      };
    } catch (error: any) {}
  }
}
