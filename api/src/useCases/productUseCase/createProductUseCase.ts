import FileHandler from "../../filesystem/fileHandle";
import ProductDomain from "../../models/domain/productDoman/ProductDomain";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import ProductRepo from "../../repo/productRepo/productRepo";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";

interface CreateVariantDTO {
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
}

interface CreatProductDTO {
  nameProduct: string;
  priceProduct: number | any;
  categoryIdProduct: number;
  supplierIdProduct: number | null;
  imageName: string;
  variants?: CreateVariantDTO[];
}

export default class CreateProductUseCase {
  private _productRepoUseCase!: ProductRepo;
  private _fileHandlerUseCase!: FileHandler;

  private _categoryRepoUseCase!: CategoryRepo;
  private _supplierRepoUseCase!: SupplierRepo;
  constructor(
    fileHandlerUseCase: FileHandler,
    productUseCase: ProductRepo,
    categoryRepo: CategoryRepo,
    supplierRepo: SupplierRepo
  ) {
    this._productRepoUseCase = productUseCase;
    this._fileHandlerUseCase = fileHandlerUseCase;
    this._categoryRepoUseCase = categoryRepo;
    this._supplierRepoUseCase = supplierRepo;
  }

  async execute(dto: CreatProductDTO): Promise<any> {
    const {
      nameProduct,
      priceProduct,
      categoryIdProduct,
      supplierIdProduct,
      imageName,
      variants = [],
    } = dto;
    try {
      // =====================
      // VALIDATION
      // =====================

      if (!nameProduct) throw new Error("Name required");

      const category = await this._categoryRepoUseCase.GetCategoryById(
        Number(categoryIdProduct)
      );

      if (!category) throw new Error("Category not found");

      const supplier = supplierIdProduct
        ? await this._supplierRepoUseCase.GetSupplierByID(
            Number(supplierIdProduct)
          )
        : null;

      const supId = supplier ? supplier.id : null;

      const isExist = await this._productRepoUseCase.IsExistProductByName(
        nameProduct
      );

      if (isExist) throw new Error("Product exists");

      // =====================
      // DOMAIN
      // =====================

      const product = new ProductDomain();

      product.setName = nameProduct;
      product.setImageProduct = imageName;

      if (variants.length > 0) {
        const unique = new Set();
        const prices: number[] = [];
        for (const v of variants) {
          if (
            !v.color ||
            !v.size ||
            v.price === undefined ||
            v.price === null
          ) {
            throw new Error("Invalid variant");
          }

          const key = `${v.color}-${v.size}`;

          if (unique.has(key)) {
            throw new Error("Duplicate variant");
          }

          unique.add(key);
          prices.push(Number(v.price));
          product.addVariant(v.color, v.size, v.price);
          product.setPrice = Math.min(...prices);
        }
      } else {
        const safePrice: any =
          priceProduct !== undefined &&
          priceProduct !== null &&
          !isNaN(priceProduct)
            ? Number(priceProduct)
            : null;

        product.setPrice = safePrice;
      }

      // =====================
      // PERSIST
      // =====================

      console.log("product product ", product);
      const createdProduct =
        await this._productRepoUseCase.createProductWithVariants(
          {
            name: product.getName,
            price: variants.length > 0 ? product.getPrice : product.getPrice,
            nameImage: imageName,
            categoryId: category.id,
            supplierId: supId,
            type: variants.length > 0 ? "VARIABLE" : "SIMPLE",
          },
          product.getVariants()
        );

      return { success: true, data: createdProduct };
    } catch (error: any) {
      if (dto.imageName) {
        await this._fileHandlerUseCase.removeFile(dto.imageName);
      }

      return { success: false, message: error.message };
    }
  }
}
