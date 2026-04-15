import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateProductWithVariantUseCase from "../../useCases/productUseCase/UpdateProductWithVariantUseCase";

export default class UpdateProductWithVariantController extends BaseController {
  private _usecase: UpdateProductWithVariantUseCase;

  constructor(usecase: UpdateProductWithVariantUseCase) {
    super();
    this._usecase = usecase;
  }

  // ===============================
  //  FORMAT RESPONSE (React-Admin)
  // ===============================
  private formatProductResponse(product: any) {
    if (!product) return null;

    const data = product.dataValues ?? product;

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      urlImage: data.nameImage
        ? `http://localhost:4000/images/${data.nameImage}`
        : null,
      categoryId: data.category?.id ?? data.categoryId,
      supplierId: data.supplierId ?? null,
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

  // ===============================
  //  MAIN CONTROLLER
  // ===============================
  protected async executeImpl(req: Request, res: Response) {
    try {
      const productId = Number(req.params.id);

      console.log(" BODY:", req.body);
      console.log(" FILE:", req.file);

      if (!productId || isNaN(productId)) {
        return this.badRequest(res, "Invalid product id");
      }

      let { variants = [], ...productData } = req.body;

      // =========================
      // 🔹 SAFE PARSE VARIANTS
      // =========================
      try {
        if (typeof variants === "string") {
          variants = JSON.parse(variants);
        }
      } catch {
        return this.badRequest(res, "Invalid variants format");
      }

      if (!Array.isArray(variants)) {
        variants = [];
      }

      // =========================
      // 🔹 TYPE FIX 
      // =========================
      const isVariable = variants.length > 0;
      productData.type = isVariable ? "VARIABLE" : "SIMPLE";

      // =========================
      // 🔹 PRICE LOGIC 
      // =========================
      if (isVariable) {
        const prices = variants.map((v: any) => Number(v.price));

        if (prices.some((p: number) => isNaN(p))) {
          return this.badRequest(res, "Invalid variant price");
        }

        productData.price = Math.min(...prices);
      } else {
        const parsed = Number(productData.price);

        if (isNaN(parsed)) {
          return this.badRequest(res, "Invalid price");
        }

        productData.price = parsed;
      }

      // =========================
      // 🔹 IMAGE HANDLING
      // =========================
      if (req.file) {
        productData.nameImage = req.file.filename;
      }
      // إذا ما جاش file → نخلي القديم (ما نبدلوش)

      // =========================
      // 🔹 CALL USECASE
      // =========================
      const result = await this._usecase.execute(
        productId,
        productData,
        variants
      );

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      // =========================
      // 🔹 FORMAT RESPONSE
      // =========================
      const cleanData = this.formatProductResponse(result.data);

      return res.status(200).json({
        data: cleanData,
      });

    } catch (err: any) {
      console.error(" UPDATE ERROR:", err);
      return this.fail(res, err.message);
    }
  }
}