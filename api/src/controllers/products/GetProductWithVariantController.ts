import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetProductWithVariantUseCase from "../../useCases/productUseCase/GetProductWithVariantUseCase";

export default class GetProductWithVariantController extends BaseController {

  private formatProductResponse(product: any) {
    if (!product) return null;
  
    const data = product.dataValues ?? product;
  
    return {
      id: data.id,
      name: data.name,
      price: data.price,
  
      // 🔥 تحويل nameImage → urlImage
      urlImage: data.nameImage
        ? `http://localhost:4000/images/${data.nameImage}`
        : null,
  
      categoryId: data.category?.id ?? data.categoryId,
      supplierId: data.supplierId,
      type: data.type,
  
      variants: Array.isArray(data.variants) ? data.variants : [],
  
      category: data.category
        ? {
            id: data.category.id,
            name: data.category.name,
          }
        : null,
    };
  }

  private _usecase: GetProductWithVariantUseCase;

  constructor(usecase: GetProductWithVariantUseCase) {
    super();
    this._usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // ======================
      // VALIDATION
      // ======================
      const id = Number(req.params.productid);

      if (!id || isNaN(id)) {
        return this.badRequest(res, "Invalid product id");
      }

      // ======================
      // USECASE
      // ======================
      const result = await this._usecase.execute(id);

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      const product = result.data;

      if (!product) {
        return this.fail(res, "Product not found");
      }

      // ======================
      // FIX RESPONSE (react-admin)
      // ======================
      // return res.status(200).json({
      //   data: product, //  IMPORTANT
      // });

      const resultproduct :any = await this.formatProductResponse(product)
      return this.resultValue(res,"success ",resultproduct)
    } catch (error: any) {
      console.error("GET PRODUCT ERROR:", error);

      return this.fail(res, error.message || "Internal server error");
    }
  }
}