import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import ProductRepo from "../../repo/productRepo/productRepo";

interface GetProductCategoryDTO {
  categoryId: number;
}

export default class GetProductByCategoryUseCase {
  private productRepo: ProductRepo;
  private categoryRepo: CategoryRepo;

  constructor(productRepo: ProductRepo, categoryRepo: CategoryRepo) {
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
  }

  async execute(dto: GetProductCategoryDTO): Promise<any> {
    try {
      // ======================
      // 1. CATEGORY
      // ======================
      const categoryDomain = await this.categoryRepo.GetCategoryById(dto.categoryId);

      if (!categoryDomain) {
        return {
          success: false,
          message: "category not found",
        };
      }

      const category = {
        id: categoryDomain.getCategoryId,
        name: categoryDomain.getName,
      };

      // ======================
      // 2. PRODUCTS
      // ======================
      const rawProducts =
        await this.productRepo.getProductsByCategoryWithVariants(dto.categoryId);

      // ======================
      // 3. NORMALIZE PRODUCTS
      // ======================
      const map = new Map<number, any>();

      for (const p of rawProducts || []) {
        if (!map.has(p.id)) {
          map.set(p.id, {
            id: p.id,
            name: p.name,
            price: p.price,
            type: p.type,
            nameImage: p.nameImage,
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

      const products = Array.from(map.values());

      // ======================
      // 4. CLEAN RESPONSE
      // ======================
      return {
        success: true,
        data: {
          category,
          products,
        },
      };

    } catch (error: any) {
      console.log("UseCase error:", error);

      return {
        success: false,
        message: error?.message || "server error",
      };
    }
  }
}