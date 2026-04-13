import FileHandler from "../../filesystem/fileHandle";
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

export default class CreateProductWithVariantUseCase {
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
      // 🔹 VALIDATION
      // =====================

      if (!nameProduct) throw new Error("Name required");
      if (!imageName) throw new Error("Image required");

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

      if (isExist) throw new Error("Product already exists");

      // =====================
      // 🔹 DETERMINE TYPE
      // =====================

      const isVariable = variants.length > 0;

      // =====================
      // 🔹 VALIDATE VARIANTS
      // =====================

      if (isVariable) {
        const unique = new Set();

        for (const v of variants) {
          // if (!v.color || !v.size || v.price == null) {
          //   throw new Error("Invalid variant");
          // }

          const key = `${v.color}-${v.size}`;
          if (unique.has(key)) {
            throw new Error("Duplicate variant");
          }

          unique.add(key);
        }
      }

      // =====================
      // 🔹 PREPARE DATA
      // =====================

      const productData = {
        name: nameProduct,
        type: isVariable ? "VARIABLE" : "SIMPLE",
       // price: isVariable ? 0 : Number(priceProduct),
        price: Number(priceProduct),
        nameImage: imageName,
        categoryId: category.id,
        supplierId: supId,
      };

      const variantsData = isVariable
        ? variants.map((v) => ({
            sku: v.sku || null,
            color: v.color,
            size: v.size,
            price: Number(v.price),
          }))
        : [];

      // =====================
      // 🔹 PERSIST
      // =====================


      console.log("beforeeeeee    ",productData,
        variantsData)
      const createdProduct =
        await this._productRepoUseCase.createProductWithVariants2(
          productData,
          variantsData
        );

      return {
        success: true,
        data: createdProduct,
      };
    } catch (error: any) {
      //  delete uploaded image if fail
      if (imageName) {
        await this._fileHandlerUseCase.removeFile(imageName);
      }

      return {
        success: false,
        message: error.message,
      };
    }
  }
}