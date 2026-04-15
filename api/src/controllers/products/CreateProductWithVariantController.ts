import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateProductWithVariantUseCase from "../../useCases/productUseCase/CreateProductWithVariantUseCase";

export default class CreateProductWithVariantController extends BaseController {
  private _usecase!: CreateProductWithVariantUseCase;

  constructor(usecase: CreateProductWithVariantUseCase) {
    super();
    this._usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      console.log("REQ BODY:", req.body, "FILE:", req.file);

      const { name, price, categoryId, supplierId } = req.body;
      const file = req.file;

      // ===============================
      //  PARSE VARIANTS
      // ===============================
      let variantList: any[] = [];

      if (req.body.variants) {
        try {
          variantList =
            typeof req.body.variants === "string"
              ? JSON.parse(req.body.variants)
              : req.body.variants;
        } catch {
          return this.badRequest(res, "Invalid variants format");
        }
      }

      // ===============================
      //  TYPE (AUTO FIX )
      // ===============================
      const isVariable = variantList.length > 0;
      const finalType = isVariable ? "VARIABLE" : "SIMPLE";

      // ===============================
      // 🔹 IMAGE VALIDATION
      // ===============================
      if (!file) {
        return this.badRequest(res, "Product image is required");
      }

      // ===============================
      //  PRICE LOGIC
      // ===============================
      let priceProduct: number;

      if (isVariable) {
        const prices = variantList.map((v) => Number(v.price));

        if (prices.some((p) => isNaN(p))) {
          return this.badRequest(res, "Invalid variant price");
        }

        priceProduct = Math.min(...prices);
      } else {
        if (!price) {
          return this.badRequest(res, "Price is required for SIMPLE product");
        }

        const parsed = Number(price);

        if (isNaN(parsed)) {
          return this.badRequest(res, "Invalid price");
        }

        priceProduct = parsed;
      }

      // ===============================
      //  DTO
      // ===============================
      const dto = {
        nameProduct: name,
        priceProduct,
        categoryIdProduct: Number(categoryId),
        supplierIdProduct: supplierId ? Number(supplierId) : null,
        imageName: file.filename, // always from multer
        variants: variantList,
        type: finalType, //  VERY IMPORTANT
      };

      console.log("DTO READY:", dto);

      // ===============================
      //  CALL USECASE
      // ===============================
      const result = await this._usecase.execute(dto);

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      return this.resultValue(
        res,
        "Product created successfully",
        result.data
      );
    } catch (error: any) {
      console.error(error);
      return this.fail(res, "Internal server error");
    }
  }
}