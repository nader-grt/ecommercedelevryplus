import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateProductUseCase from "../../useCases/productUseCase/createProductUseCase";

export default class createProductController extends BaseController {
  private _usecasecreateProduct!: CreateProductUseCase;

  constructor(createProductUseCase: CreateProductUseCase) {
    super();
    this._usecasecreateProduct = createProductUseCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      console.log("REQ BODY:", req.body);

      const { name, price, categoryId, supplierId } = req.body;
      const file = req.file;

      let variantList: any[] = [];

      if (req.body.variants) {
        try {
          variantList = JSON.parse(req.body.variants);
        } catch {
          return this.badRequest(res, "Invalid variants format");
        }
      }

      if (!file) {
        return this.badRequest(res, "Product image is required");
      }

      const isVariable = variantList.length > 0;

      let priceProduct: number;

      if (isVariable) {
        const prices = variantList.map(v => Number(v.price));

        if (prices.some(p => isNaN(p))) {
          return this.badRequest(res, "Invalid variant price");
        }

        priceProduct = Math.min(...prices);
      }

   
      else {
        if (price === "" || price === null || price === undefined) {
          return this.badRequest(res, "Price is required for SIMPLE product");
        }

        const parsed = Number(price);

        if (isNaN(parsed)) {
          return this.badRequest(res, "Invalid price");
        }

        priceProduct = parsed;
      }

 
      const dto = {
        nameProduct: name,
        priceProduct,
        categoryIdProduct: Number(categoryId),
        supplierIdProduct: supplierId ? Number(supplierId) : null,
        imageName: file.filename,
        variants: variantList,
      };

      console.log("DTO READY:", dto);

       const result = await this._usecasecreateProduct.execute(dto);


      return this.resultValue(res, "product created successfully", result.data);

    } catch (error) {
      console.log(error);
      return this.fail(res, "internal error");
    }
  }
}