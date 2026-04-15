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
  
    try {
      let {
        name,
        price,
        categoryId,
        supplierId,
        nameImage,
        urlImage,
      } = dto;
  
      // ===============================
      // 🔥 لا تثق في frontend
      // ===============================
      name = (name || "").replace(/^"+|"+$/g, "").trim();
  
      const numericPrice = Number(price);
      const numericCategoryId = Number(categoryId);
      const numericSupplierId = supplierId ? Number(supplierId) : null;
  
      const safeVariants = Array.isArray(variants) ? variants : [];
  
      const isVariable = safeVariants.length > 0;
      const type = isVariable ? "VARIABLE" : "SIMPLE";
  
      // ===============================
      // VALIDATION
      // ===============================
      if (!name) throw new Error("Product name is required");
  
      if (isNaN(numericPrice)) {
        throw new Error("Invalid product price");
      }
  
      const category = await this._categoryRepo.GetCategoryById(numericCategoryId);
      if (!category) throw new Error("Category not found");
  
      let supId = null;
      if (numericSupplierId) {
        const supplier = await this._supplierRepo.GetSupplierByID(numericSupplierId);
        if (!supplier) throw new Error("Supplier not found");
        supId = supplier.id;
      }
  
      // ===============================
      // VARIANTS VALIDATION
      // ===============================
      if (isVariable) {
        const unique = new Set();
  
        for (const v of safeVariants) {
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
      // IMAGE
      // ===============================
      let finalImageUrl = urlImage;
  
      if (nameImage && typeof nameImage !== "string") {
        const uploaded = await this._fileHandler.save(nameImage);
        finalImageUrl = uploaded.filename;
      }
  
      // ===============================
      // PRODUCT DATA
      // ===============================
      const productData = {
        name,
        type,
        price: numericPrice,
        categoryId: category.id,
        supplierId: supId,
        urlImage: finalImageUrl,
      };
  
      const updatedProduct =
        await this._productRepo.updateProductWithVariants(
          productId,
          productData,
          safeVariants
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


/**
 // async execute(
  //   productId: number,
  //   dto: any,
  //   variants?: any[]
  // ): Promise<any> {
  //   const {
  //     name,
  //     price,
  //     categoryId,
  //     supplierId,
  //     nameImage,
  //     urlImage,
  //   } = dto;

  //   console.log("UPDATED PRODUCT WITH VARIANT", dto);

  //   try {
  //     // ===============================
  //     // 🔹 BASIC VALIDATION
  //     // ===============================
  //     if (!name) throw new Error("Product name is required");

  //     // ===============================
  //     // 🔹 CATEGORY CHECK
  //     // ===============================
  //     const category = await this._categoryRepo.GetCategoryById(
  //       Number(categoryId)
  //     );

  //     if (!category) throw new Error("Category not found");

  //     // ===============================
  //     // 🔹 SUPPLIER CHECK
  //     // ===============================
  //     const supplier = supplierId
  //       ? await this._supplierRepo.GetSupplierByID(Number(supplierId))
  //       : null;

  //     const supId = supplier ? supplier.id : null;

  //     // ===============================
  //     // 🔹 TYPE
  //     // ===============================
  //     const isVariable = variants && variants.length > 0;
  //     const type = isVariable ? "VARIABLE" : "SIMPLE";

  //     // ===============================
  //     // 🔹 VARIANTS VALIDATION
  //     // ===============================
  //     if (isVariable) {
  //       const unique = new Set();

  //       for (const v of variants) {
  //         const key = `${v.color}-${v.size}`;

  //         if (unique.has(key)) {
  //           throw new Error("Duplicate variant combination");
  //         }

  //         unique.add(key);

  //         if (v.price == null || isNaN(Number(v.price))) {
  //           throw new Error("Invalid variant price");
  //         }
  //       }
  //     }

  //     // ===============================
  //     // 🔐 SECURITY: IMAGE VALIDATION
  //     // ===============================
  //     if (nameImage && typeof nameImage !== "string") {
  //       const allowed = ["image/jpeg", "image/png", "image/webp"];

  //       if (!allowed.includes(nameImage.mimetype)) {
  //         throw new Error("Invalid image type");
  //       }

  //       if (nameImage.size > 2 * 1024 * 1024) {
  //         throw new Error("Image too large (max 2MB)");
  //       }
  //     }

  //     // ===============================
  //     // 🔥 IMAGE LOGIC
  //     // ===============================
  //     let finalImageUrl = urlImage;

  //     if (nameImage && typeof nameImage !== "string") {
  //       if (urlImage) {
  //         await this._fileHandler.removeFile(urlImage);
  //       }

  //       const uploaded = await this._fileHandler.save(nameImage);
  //       finalImageUrl = uploaded.url;
  //     }

  //     // ===============================
  //     // 🔹 PRODUCT DATA
  //     // ===============================
  //     const productData = {
  //       name,
  //       type,
  //       price: Number(price),
  //       categoryId: category.id,
  //       supplierId: supId,
  //       urlImage: finalImageUrl,
  //     };

  //     // ===============================
  //     // 🔹 UPDATE REPO
  //     // ===============================
  //     const updatedProduct =
  //       await this._productRepo.updateProductWithVariants(
  //         productId,
  //         productData,
  //         variants
  //       );

  //     console.log("UPDATED SUCCESSFULLY", updatedProduct);

  //     return {
  //       success: true,
  //       data: updatedProduct,
  //     };
  //   } catch (error: any) {
  //     console.log("ERROR:", error.message);

  //     if (nameImage && typeof nameImage !== "string") {
  //       await this._fileHandler.removeFile(nameImage);
  //     }

  //     return {
  //       success: false,
  //       message: error.message,
  //     };
  //   }
  // }
 */