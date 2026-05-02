import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetProductByCategoryUseCase from "../../useCases/productUseCase/GetProductByCategoryUseCase";

export default class GetProductByCategoryController extends BaseController {
  private useCase: GetProductByCategoryUseCase;

  constructor(useCase: GetProductByCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  // ======================
  // FORMAT PRODUCTS
  // ======================
  private formatProducts(products: any[]) {
    const map = new Map<number, any>();

    for (const p of products || []) {
      if (!map.has(p.id)) {
        map.set(p.id, {
          id: p.id,
          name: p.name,
          price: p.price,
          type: p.type,
          urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
          variants: [],
        });
      }

      const product = map.get(p.id);

      if (Array.isArray(p.variants)) {
        for (const v of p.variants) {
          product.variants.push({
            id: v.id,
            sku: v.sku,
            color: v.color,
            size: v.size,
            price: Number(v.price),
          });
        }
      }
    }

    return Array.from(map.values());
  }

  // ======================
  // EXECUTE
  // ======================
  protected async executeImpl(req: Request, res: Response): Promise<any> {
    const { categoryid } = req.params;

    try {
      const result = await this.useCase.execute({
        categoryId: Number(categoryid),
      });

      if (!result.success) {
        return this.fail(res, result.message);
      }

      const { category, products } = result.data;

      const formattedProducts = this.formatProducts(products);

      return this.resultValue(res, "products", {
        category,
        products: formattedProducts,
      });

    } catch (error) {
      console.log("Controller error:", error);
      return this.fail(res, "server error");
    }
  }
}