import FileHandler from "../../filesystem/fileHandle";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import ProductRepo from "../../repo/productRepo/productRepo";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";

export default class UpdateProductWithVariantUseCase {
  private _productRepo!: ProductRepo;
  private _fileHandler!: FileHandler;
  private _categoryRepo!: CategoryRepo;
  private _supplierRepo!: SupplierRepo;

  constructor(
    fileHandler: FileHandler,
    productRepo: ProductRepo,
    categoryRepo: CategoryRepo,
    supplierRepo: SupplierRepo
  ) {
    this._productRepo = productRepo;
    this._fileHandler = fileHandler;
    this._categoryRepo = categoryRepo;
    this._supplierRepo = supplierRepo;
  }

  async execute(
    productId: number,
    dto: any,
    variants?: any[]
  ): Promise<any> {
    const {
      name,
      price,
      categoryId,
      supplierId,
      nameImage,
    } = dto;


    console.log("UPDATED PRODUCT WITH VARIANT  ",dto)
    try {
      // ===============================
      // 🔹 BASIC VALIDATION
      // ===============================
      if (!name) throw new Error("Product name is required");

      // ===============================
      // 🔹 CATEGORY CHECK
      // ===============================
      const category = await this._categoryRepo.GetCategoryById(
        Number(categoryId)
      );

      if (!category) throw new Error("Category not found");

      // ===============================
      // 🔹 SUPPLIER CHECK (optional)
      // ===============================
      const supplier = supplierId
        ? await this._supplierRepo.GetSupplierByID(Number(supplierId))
        : null;

      const supId = supplier ? supplier.id : null;

      // ===============================
      // 🔹 DETERMINE TYPE
      // ===============================
      const isVariable = variants && variants.length > 0;

      const type = isVariable ? "VARIABLE" : "SIMPLE";

      // ===============================
      // 🔹 VALIDATE VARIANTS (PRO RULE)
      // ===============================
      if (isVariable) {
        const unique = new Set();

        for (const v of variants) {
          const key = `${v.color}-${v.size}`;

          if (unique.has(key)) {
            throw new Error("Duplicate variant combination");
          }

          unique.add(key);

          if (v.price == null || isNaN(Number(v.price))) {
            throw new Error("Invalid variant price");
          }
        }
      }

      // ===============================
      // 🔹 PREPARE DATA
      // ===============================
      const productData = {
        name,
        type,
        price: Number(price),
       categoryId: category.id,
        supplierId: supId,
        nameImage,
      };

      // ===============================
      // 🔹 CALL REPO ( ALL LOGIC THERE)
      // ===============================
      const updatedProduct =
        await this._productRepo.updateProductWithVariants(
          productId,
          productData,
          variants
        );

      // ===============================
      // 🔹 RETURN
      // ===============================

      console.log("updatedddddddd //////",updatedProduct)
      return {
        success: true,
        data: updatedProduct,
      };

    } catch (error: any) {

      // 🧹 CLEAN IMAGE IF FAIL
      if (nameImage) {
        await this._fileHandler.removeFile(nameImage);
      }

      return {
        success: false,
        message: error.message,
      };
    }
  }
}