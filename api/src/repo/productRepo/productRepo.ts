import { InferAttributes, Op } from "sequelize";
import ProductDomain from "../../models/domain/productDoman/ProductDomain";
import { Category, OrderItem, Product, sequelize, Variant } from "../../models/main";
import productRepoInterface from "./productRepoInterface";
import QueryBuilder from "../../util/QuiryBuilder";

// type ProductType = InferAttributes<typeof Product>;

export default class ProductRepo extends productRepoInterface {
  private cache: any = null;
  private cacheTime = 0;
  public async FindAllProducts() {}

  static async getProductsMapByIds(
    productIds: number[]
  ): Promise<Map<number, any>> {
    const products = await Product.findAll({
      where: { id: productIds },
      raw: true,
    });

    console.log("dbbbbbbbbbbbbbb  ", products);
    const productMap = new Map<number, any>();
    for (const p of products) {
      productMap.set(p.id, p);
    }

    return productMap;
  }
  async findById(id: number) {
    return Product.findByPk(id);
  }

  public async GetProductById(id: number): Promise<any> {
    const t = await sequelize.transaction();
    try {
      const p = await Product.findOne({
        where: { id: id },
        raw: true,
      });

      if (!p) return null;

      return p;
    } catch (error) {
      console.log(error);
    }
  }

  public async createProduct(
    product: ProductDomain,
    categoryId: number,
    supplierId: number
  ): Promise<void> {
    const t = await sequelize.transaction();

    try {
      //    console.log("pro repoooooooo is p  is  ",product ,categoryId,supplierId)
      await Product.create(
        {
          name: product.getName,
          price: product.getPrice,
          nameImage: product.getImageProduct,
          categoryId: categoryId,
          supplierId: supplierId,
          type:product.getType,        },
        { transaction: t }
      );
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  public async IsExistProductByName(nameProduct: string): Promise<boolean> {
    const t = await sequelize.transaction(); //

    try {
      const product = await Product.findOne({
        where: { name: nameProduct },
        transaction: t,
      });

      await t.commit(); //  transaction

      return product !== null;
    } catch (error) {
      await t.rollback();
      console.log(error);
      return false;
    }
  }

  static async IsExistProductByImage(nameImage: string): Promise<boolean> {
    try {
      const product = await Product.findOne({ where: { nameImage } });
      return product !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async getRandomProducts(limit: number): Promise<any> {
    try {
      console.log("limin in fn private ", limit);
      const maxId: number = await Product.max("id");
      console.log("maxxxxxxxxxxxx id", maxId);
      if (!maxId) return [];

      const randomId = Math.floor(Math.random() * maxId);

      //    console.log("randomidd ",randomId)
      return await Product.findAll({
        where: {
          id: {
            [Op.gte]: randomId,
          },
        },
        limit,
        order: [["id", "ASC"]],
        raw: true,
      });
    } catch (error) {}
  }

  public async getRandomProductsCached(limit: number) {
    const now = Date.now();

    if (this.cache && now - this.cacheTime < 5 * 60 * 1000) {
      return this.cache; // from cache
    }

    const data = await this.getRandomProducts(limit);

    console.log("data getRandomProductsCached  ", data);

    this.cache = data;
    this.cacheTime = now;

    return data;
  }

  public async getProductByCategoryId(categoryId: number): Promise<{
    products: any[];
    count: number;
  }> {
    try {
      const listProductCategory = await Product.findAll({
        where: { categoryId },
        raw: true,
      });
  
      return {
        products: listProductCategory || [],
        count: listProductCategory?.length || 0,
      };
    } catch (error) {
      console.log(error);
      return {
        products: [],
        count: 0,
      };
    }
  }

  public async getProductCountByCategoryId(categoryId: number): Promise<number> {
    return await Product.count({
      where: { categoryId },
    });
  }



//   public async getProductsByCategoryWithVariants(categoryId: number): Promise<any> {
//     try {
//       return await Product.findAll({
//         where: { categoryId },
  
//         attributes: ["id", "name", "price", "type", "nameImage"],
  
//         include: [
//           {
//             model: Variant,
//             as: "variants",
//             attributes: ["id", "sku", "color", "size", "price"],
//           },
//         ],
//         raw: true,
// nest: true
//       });
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }

public async getProductsByCategoryWithVariants(categoryId: number): Promise<any> {
  try {
    return await Product.findAll({
      where: { categoryId },

      attributes: ["id", "name", "price", "type", "nameImage"],

      include: [
        {
          model: Variant,
          as: "variants",
          attributes: ["id", "sku", "color", "size", "price"],
        },
      ],
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

  public async DeleteProductById(id: number): Promise<any> {
    try {
      //1771029842687-836705519.jpg

      const deletedCount = await Product.destroy({
        where: { id: id },
      });

      if (deletedCount === 0) {
        throw new Error("Product not found");
      }

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  public async getAllProductsFiltred(cleanQuery:any,notFiltred:any):Promise<any>{

    try {
  
      const qb = new QueryBuilder(cleanQuery, Product)
        .filter()
        .sort()
        .paginate();
  
      const options = qb.build();
  
      const { rows, count } = await Product.findAndCountAll({
        ...options,
        raw: true
      });
  
      // return {
      //   data: rows,
      //   total: count
      // };

      return { data: rows || [], total: count || 0 };
  
    } catch (error) {
  
      console.error(error);
      throw error;
  
    }
  }

  public async GetProductWithVariantsById(id: number): Promise<any> {
    try {
      const product = await Product.findOne({
        where: { id },
        include: [
          {
            model: sequelize.models.Variant,
            as: "variants",
            required: false,
          },
          {
            model: Category,
            as: "category",
            required: false,
          },
        ],
        raw: false,
        nest: true
      });
  
      if (!product) {
        return null;
      }
  
      return product;
    } catch (error) {
      console.error("GetProductById Error:", error);
      throw new Error("Failed to fetch product");
    }
  }

 public async createProductWithVariants(
    product: any,
    variants: any[],
    transaction?: any
  ): Promise<any> {
  
    const t = transaction || await sequelize.transaction();
  
    try {
  
      // create product
      const createdProduct = await Product.create(product, {
        transaction: t,
      });
  
      //  create variants (if exist)
      if (variants && variants.length > 0) {
  
        const formattedVariants = variants.map((v) => ({
          productId: createdProduct.id,
          sku: v.getSKU,
          color: v.getColor,
          size: v.getSize,
          price: v.getPrice,
        }));
  
        await sequelize.models.Variant.bulkCreate(formattedVariants, {
          transaction: t,
        });
      }
  
      if (!transaction) await t.commit();
  
      return createdProduct;
  
    } catch (error) {
  
      if (!transaction) await t.rollback();
  
      throw error;
    }
  }


  public async getAllProductVariantsFiltred(
    cleanQuery: any,
    notFiltred: any
  ): Promise<any> {
    try {
      const qb = new QueryBuilder(cleanQuery, Product)
        .filter()
        .sort()
        .paginate();
  
      const options = qb.build();
  
      const { rows, count } = await Product.findAndCountAll({
        ...options,
      
        include: [
          {
            model: Variant,
            as: "variants",
            attributes: {
              exclude: ["createdAt", "updatedAt"]
            }
          },
        ],
      
        distinct: true,
        nest: true,
        raw: true
      });
  
      return {
        data: rows,
        total: count || 0,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  public async createProductWithVariants2(
    productData: any,
    variants: any[]
  ): Promise<any> {

    console.log("rrrrrrrrrrrepo vvv ppp ",productData ,"  variantss  ",variants)
    const { name, type, price, categoryId, supplierId, nameImage } = productData;
  
    return await sequelize.transaction(async (t) => {
      // ===============================
      // 🔹 VALIDATION
      // ===============================
      if (type === "SIMPLE" && variants?.length) {
        throw new Error("SIMPLE product cannot have variants");
      }
  
      if (type === "VARIABLE" && (!variants || variants.length === 0)) {
        throw new Error("VARIABLE product must have variants");
      }
  
      if (!nameImage) {
        throw new Error("nameImage is required");
      }
  
      // ===============================
      // 🔹 CREATE PRODUCT
      // ===============================
      const product = await Product.create(
        {
          name,
          type,
          categoryId,
          supplierId: supplierId || null,
          nameImage, // FIX
       //   price: type === "SIMPLE" ? price : price,
          price:  price,
        },
        { transaction: t }
      );
  
      // ===============================
      // 🔹 CREATE VARIANTS
      // ===============================
      if (type === "VARIABLE") {
        const variantsData = variants.map((v: any) => ({
          sku: v.sku || null,
          color: v.color || null,
          size: v.size || null,
          price: v.price,
          productId: product.id,
        }));
  
        await Variant.bulkCreate(variantsData, { transaction: t });
      }
  
      // ===============================
      // 🔹 RETURN RESULT
      // ===============================
      return await Product.findByPk(product.id, {
        include: [
          {
            model: Variant,
            as: "variants", //  FIX
          },
        ],
        transaction: t,
      });
    });

   
  }
  public async updateProductWithVariants(
    productId: number,
    productData: any,
    variants?: any[]
  ): Promise<any> {
  
    const { name, type, price, categoryId, supplierId, nameImage } = productData;
  
    return await sequelize.transaction(async (t) => {
  
      // ===============================
      // 🔹 GET PRODUCT
      // ===============================
      const product: any = await Product.findByPk(productId, {
        include: [{ model: Variant, as: "variants" }, { model: Category, as: "category" }],
        transaction: t,
        raw: false,
  nest: true
      });
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      // ===============================
      //  SMART HANDLING
      // ===============================
      const hasVariants = variants !== undefined;   // 👈 مهم
      const safeVariants = variants ?? [];          // 👈 مهم
  
      // ===============================
      // 🔹 VALIDATION
      // ===============================
      if (type === "SIMPLE" && safeVariants.length > 0) {
        throw new Error("SIMPLE product cannot have variants");
      }
  
      if (type === "VARIABLE" && hasVariants && safeVariants.length === 0) {
        throw new Error("VARIABLE product must have variants");
      }
  
      // ===============================
      // 🔹 UPDATE PRODUCT
      // ===============================
      await product.update({
        name,
        type,
        price,
        categoryId,
        supplierId: supplierId || null,
        nameImage
      }, { transaction: t });
  
      // ===============================
      //  CASE: SIMPLE
      // ===============================
      if (type === "SIMPLE") {
  
        if (hasVariants) {
          // user بعث variants → نحذفهم
          await Variant.destroy({
            where: { productId },
            transaction: t
          });
        }
  
        return await Product.findByPk(productId, {
          include: [{ model: Variant, as: "variants" } ,{ model: Category, as: "category" }],
          transaction: t,
          raw: false,
  nest: true
        });
      }
  
      // ===============================
      //  CASE: VARIABLE
      // ===============================
      const existingVariants = product.variants || [];
  
      const existingMap = new Map<number, any>();
      existingVariants.forEach((v: any) => {
        existingMap.set(v.id, v);
      });
  
      const incomingIds = new Set<number>();
  
      // ===============================
      // 🔹 UPDATE / CREATE
      // ===============================
      if (hasVariants) {
  
        for (const v of safeVariants) {
  
          // -----------------------
          // UPDATE
          // -----------------------
          if (v.id) {
  
            incomingIds.add(v.id);
  
            const existing = existingMap.get(v.id);
  
            if (!existing) {
              throw new Error(`Variant ${v.id} not found`);
            }
  
            const used = await OrderItem.count({
              where: { variantId: v.id },
              transaction: t
            });
  
            // ❗ حماية business
            if (
              used > 0 &&
              (v.color !== existing.color || v.size !== existing.size)
            ) {
              throw new Error("Cannot modify variant used in orders");
            }
  
            await existing.update({
              sku: v.sku || null,
              color: v.color,
              size: v.size,
              price: v.price
            }, { transaction: t });
  
          } else {
  
            // -----------------------
            // CREATE
            // -----------------------
            await Variant.create({
              productId,
              sku: v.sku || null,
              color: v.color,
              size: v.size,
              price: v.price
            }, { transaction: t });
          }
        }
  
        // ===============================
        //  DELETE REMOVED
        // ===============================
        for (const existing of existingVariants) {
  
          if (!incomingIds.has(existing.id)) {
  
            const used = await OrderItem.count({
              where: { variantId: existing.id },
              transaction: t
            });
  
            if (used > 0) {
              throw new Error("Cannot delete variant used in orders");
            }
  
            await existing.destroy({ transaction: t });
          }
        }
      }
  
      // ===============================
      // 🔹 RETURN FINAL
      // ===============================
      return await Product.findByPk(productId, {
        include: [{ model: Variant, as: "variants" }  ,{ model: Category, as: "category" }],
        transaction: t,
        raw: false,
  nest: true
      });
  
    });
  }


  
  public async GetProductWithVariant(productid?: number): Promise<any> {
    const t = await sequelize.transaction();
  
    try {
      // ===============================
      // 🔹 SINGLE PRODUCT
      // ===============================
      if (productid) {
        const product: any = await Product.findByPk(productid, {
          include: [
            { model: Variant, as: "variants" },
            { model: Category, as: "category" }
          ],
          transaction: t,
          nest: true
        });
  
        if (!product) {
          await t.rollback();
          return { data: null };
        }
  
        const data = product.get({ plain: true });
  
        const formatted = {
          id: data.id,
          name: data.name,
          price: data.price,
          type: data.type,
  
          categoryId: data.category?.id ?? data.categoryId,
          supplierId: data.supplierId,
  
          urlImage: data.nameImage
            ? `http://localhost:4000/images/${data.nameImage}`
            : null,
  
          variants: (data.variants || []).map((v: any) => ({
            id: v.id,
            sku: v.sku,
            color: v.color,
            size: v.size,
            price: Number(v.price)
          })),
  
          category: data.category
            ? {
                id: data.category.id,
                name: data.category.name
              }
            : null
        };
  
        await t.commit();
  
        return {
          data: formatted //  React-admin
        };
      }
  
      // ===============================
      // 🔹 LIST PRODUCTS
      // ===============================
      const { rows, count } = await Product.findAndCountAll({
        include: [
          { model: Variant, as: "variants" },
          { model: Category, as: "category" }
        ],
        order: [["id", "ASC"]],
        transaction: t,
        distinct: true,
        nest: true
      });
  
      const formattedList = rows.map((product: any) => {
        const data = product.get({ plain: true });
  
        return {
          id: data.id,
          name: data.name,
          price: data.price,
          type: data.type,
  
          categoryId: data.category?.id ?? data.categoryId,
          supplierId: data.supplierId,
  
          urlImage: data.nameImage
            ? `http://localhost:4000/images/${data.nameImage}`
            : null,
  
          variants: (data.variants || []).map((v: any) => ({
            id: v.id,
            sku: v.sku,
            color: v.color,
            size: v.size,
            price: Number(v.price)
          })),
  
          category: data.category
            ? {
                id: data.category.id,
                name: data.category.name
              }
            : null
        };
      });
  
      await t.commit();
  
      return {
        data: formattedList,
        total: count // React-admin
      };
  
    } catch (error: any) {
      await t.rollback();
      console.error(" GetProductWithVariant error:", error.message);
  
      throw error;
    }
  }

  public async DeleteProductWithVariant(productId?: number): Promise<any> {
    const t = await sequelize.transaction();
  
    try {
      if (!productId) {
        throw new Error("Product id is required");
      }
  
      // =========================
      // 🔹 CHECK EXISTENCE
      // =========================
      const product = await Product.findOne({
        where: {
          id: productId,
          isDeleted: false
        },
        transaction: t
      });
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      // =========================
      // 🔹 CHECK ORDERS
      // =========================
      const hasOrders = await this.hasOrders(productId);
  
      if (hasOrders) {
        // =========================
        // SOFT DELETE
        // =========================
        await Product.update(
          { isDeleted: true },
          { where: { id: productId }, transaction: t }
        );
  
        await Variant.update(
          { isDeleted: true },
          { where: { productId }, transaction: t }
        );
  
        await t.commit();
  
        return {
          success: true,
          type: "SOFT_DELETE",
          message: "Product archived (used in orders)",
        };
      }
  
      // =========================
      //  HARD DELETE
      // =========================
      await Variant.destroy({
        where: { productId },
        transaction: t
      });
  
      await Product.destroy({
        where: { id: productId },
        transaction: t
      });
  
      await t.commit();
  
      return {
        success: true,
        type: "HARD_DELETE",
        message: "Product deleted permanently",
      };
  
    } catch (error: any) {
      await t.rollback();
      console.error("DeleteProductWithVariant error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  public async hasOrders(productId: number): Promise<boolean> {
    // =========================
    // 🔹 CHECK DIRECT (productId)
    // =========================
    const directOrder = await OrderItem.findOne({
      where: { productId },
      attributes: ["id"],
    });
  
    if (directOrder) return true;
  
    // =========================
    // 🔹 GET ACTIVE VARIANTS
    // =========================
    const variants = await Variant.findAll({
      where: {
        productId,
        isDeleted: false //  
      },
      attributes: ["id"],
    });
  
    const variantIds = variants.map(v => v.id);
  
    if (variantIds.length === 0) return false;
  
    // =========================
    // 🔹 CHECK VARIANT ORDERS
    // =========================
    const variantOrder = await OrderItem.findOne({
      where: {
        variantId: variantIds
      },
      attributes: ["id"],
    });
  
    return !!variantOrder;
  }

  public async softDeleteWithVariants(productId: number): Promise<void> {
    const t = await sequelize.transaction();
  
    try {
      await Variant.update(
        { isDeleted: true },
        { where: { productId }, transaction: t }
      );
  
      await Product.update(
        { isDeleted: true },
        { where: { id: productId }, transaction: t }
      );
  
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
