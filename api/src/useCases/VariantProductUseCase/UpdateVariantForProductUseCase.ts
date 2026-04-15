import VariantDomain from "../../models/domain/VariantDomain/VariantDomain";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class UpdateVariantForProductUseCase {
  private _repo: VariantProductRepo;

  constructor(repo: VariantProductRepo) {
    this._repo = repo;
  }

  async execute(data: any): Promise<any> {
    const { id, color, size, price, sku } = data;

    try {
      // ===============================
      // 1. GET VARIANT
      // ===============================
      const variant = await this._repo.getVariantById(id);

      if (!variant) {
        throw new Error("Variant not found");
      }

      // ===============================
      // 2. PRODUCT TYPE CHECK
      // ===============================
      if (variant.product.type === "SIMPLE") {
        throw new Error("Cannot update variant for SIMPLE product");
      }

      // ===============================
      // 3. CHECK IF USED IN ORDERS
      // ===============================
      const isUsed = await this._repo.isVariantUsed(id);

      // ===============================
      // 4. BUSINESS RULES ENGINE
      // ===============================
      if (isUsed) {
        const isColorChanged = color && color !== variant.color;
        const isSizeChanged = size && size !== variant.size;
        const isPriceChanged = price && Number(price) !== Number(variant.price);

        if (isColorChanged || isSizeChanged || isPriceChanged) {
          throw new Error(
            "Cannot modify color, size or price because variant is used in orders"
          );
        }
      }

      // ===============================
      // 5. DUPLICATE COMBINATION CHECK
      // ===============================
      const existingCombo = await this._repo.findDuplicateCombination(
        variant.productId,
        color ?? variant.color,
        size ?? variant.size,
        id
      );

      if (existingCombo) {
        throw new Error("Variant combination already exists");
      }

      // ===============================
      // 6. SKU VALIDATION
      // ===============================
      if (sku) {
        const existingSku = await this._repo.findBySku(sku);

        if (existingSku && existingSku.id !== id) {
          throw new Error("SKU already exists");
        }
      }

      // ===============================
      // 7. BUILD DOMAIN
      // ===============================
      const domain = new VariantDomain(
        color ?? variant.color,
        size ?? variant.size,
        price ?? variant.price,
        sku ?? variant.sku
      );

      // ===============================
      // 8. UPDATE
      // ===============================
      const updated = await this._repo.updateVariant(id, domain.toObject());

      return updated;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}