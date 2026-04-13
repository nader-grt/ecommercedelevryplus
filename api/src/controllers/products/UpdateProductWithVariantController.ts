import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateProductWithVariantUseCase from "../../useCases/productUseCase/UpdateProductWithVariantUseCase";

export default class UpdateProductWithVariantController extends BaseController {


  private formatProductResponse(product: any) {
    if (!product) return null;
  
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      nameImage: product.nameImage,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      type: product.type,
      variants: product.variants || [],
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
    };
  }
  private _usecase: UpdateProductWithVariantUseCase;

  constructor(usecase: UpdateProductWithVariantUseCase) {
    super();
    this._usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {

      // ===============================
      // 🔹 1. GET ID
      // ===============================
      const { id } = req.params;

      if (!id) {
        return this.badRequest(res, "Product id is required");
      }

      // ===============================
      // 🔹 2. EXTRACT BODY
      // ===============================
      let { variants = [], ...productData } = req.body;

      // ===============================
      // 🔹 3. HANDLE FORM-DATA
      // ===============================
      if (typeof variants === "string") {
        try {
          variants = JSON.parse(variants);
        } catch {
          return this.badRequest(res, "Invalid variants format");
        }
      }

      // ===============================
      // 🔹 4. IMAGE UPDATE (optional)
      // ===============================
      if (req.file) {
        productData.nameImage = req.file.filename;
      }

      // ===============================
      // 🔹 5. CALL BUSINESS LOGIC
      // ===============================
      const result = await this._usecase.execute(
        Number(id),
        productData,
        variants
      );

      // ===============================
      // 🔹 6. SUCCESS RESPONSE
      // ===============================

      const cleanData = this.formatProductResponse(result.data);
      return this.resultValue(
        res,
        "Product updated successfully",
        result.data
      );

    } catch (error: any) {
      console.error("UpdateProduct error:", error);

      return this.fail(
        res,
        error.message || "Internal server error"
      );
    }
  }
}