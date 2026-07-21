import FileHandler from "../../filesystem/fileHandle";
import { ProductType } from "../../models/product";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import ProductRepo from "../../repo/productRepo/productRepo";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";
import GetCompanyOwnersUseCase from "../companyUseCase/GetCompanyOwnersUseCase";

export default class UpdateProductWithVariantUseCase {
  constructor(
    private _fileHandler: FileHandler,
    private _productRepo: ProductRepo,
    private _categoryRepo: CategoryRepo,
    private _supplierRepo: SupplierRepo,
    private _userCompany: GetCompanyOwnersUseCase
  ) {}

  async execute(
    productId: number,
    dto: any,
    variants: any[] = []
  ): Promise<any> {
    try {
      let { name, price, categoryId, supplierId, nameImage, urlImage } = dto;

      // =====================================
      // GET COMPANY
      // =====================================

      const company: any = await this._userCompany.execute();

      if (!company || !company[0]?.company?.id) {
        throw new Error("Company not found");
      }

      const companyId = company[0].company.id;

      // =====================================
      // CLEAN INPUT
      // =====================================

      name = (name ?? "").replace(/^"+|"+$/g, "").trim();

      const numericPrice = Number(price);

      const numericCategoryId = Number(categoryId);

      const numericSupplierId = supplierId ? Number(supplierId) : null;

      const safeVariants = Array.isArray(variants) ? variants : [];

      // =====================================
      // DETERMINE TYPE
      // =====================================

      // const type =
      // safeVariants.length > 0
      // ? "VARIABLE"
      // : "SIMPLE";

      const type: ProductType = safeVariants.length > 0 ? "VARIABLE" : "SIMPLE";

      // =====================================
      // VALIDATION
      // =====================================

      if (!name) {
        throw new Error("Product name is required");
      }

      if (isNaN(numericPrice)) {
        throw new Error("Invalid product price");
      }

      // =====================================
      // CATEGORY
      // =====================================

      const category = await this._categoryRepo.GetCategoryById(
        numericCategoryId
      );

      if (!category) {
        throw new Error("Category not found");
      }

      // =====================================
      // SUPPLIER
      // =====================================

      let supId: number | null = null;

      if (numericSupplierId) {
        const supplier = await this._supplierRepo.GetSupplierByID(
          numericSupplierId
        );

        if (!supplier) {
          throw new Error("Supplier not found");
        }

        supId = supplier.id;
      }

      // =====================================
      // VARIANT VALIDATION
      // =====================================

      if (type === "VARIABLE") {
        const unique = new Set();

        for (const variant of safeVariants) {
          const key = `${variant.color}-${variant.size}`;

          if (unique.has(key)) {
            throw new Error("Duplicate variant");
          }

          unique.add(key);

          if (variant.price === undefined || isNaN(Number(variant.price))) {
            throw new Error("Invalid variant price");
          }
        }
      }

      // =====================================
      // IMAGE
      // =====================================

      let finalImage = urlImage;

      if (nameImage && typeof nameImage !== "string") {
        const uploaded = await this._fileHandler.save(nameImage);

        finalImage = uploaded.filename;
      }

      // =====================================
      // PRODUCT DATA
      // =====================================

      const productData = {
        name,

        type,

        price: numericPrice,

        categoryId: category.getCategoryId,

        supplierId: supId,

        nameImage: finalImage,

        companyId,

        variants: safeVariants,
      };

      // =====================================
      // UPDATE
      // =====================================

      const updatedProduct = await this._productRepo.updateProductWithVariants(
        productId,
        productData
      );

      if (!updatedProduct) {
        throw new Error("Update failed");
      }

      return {
        success: true,

        data: updatedProduct,
      };
    } catch (error: any) {
      return {
        success: false,

        message: error.message,
      };
    }
  }
}
