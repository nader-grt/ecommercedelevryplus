import ProductRepo from "../../repo/productRepo/productRepo";

export default class GetProductWithVariantUseCase {
  private _productRepo: ProductRepo;

  constructor(productRepo: ProductRepo) {
    this._productRepo = productRepo;
  }

  async execute(productId: number): Promise<any> {
    try {
      if (!productId || isNaN(productId)) {
        throw new Error("Invalid product id");
      }

      const product =
        await this._productRepo.GetProductWithVariantsById(productId);

      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}