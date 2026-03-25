import { InferAttributes, Op } from "sequelize";
import ProductDomain from "../../models/domain/productDoman/ProductDomain";
import { Product, sequelize, Variant } from "../../models/main";
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

  public async getProductByCategoryId(categoryId: number): Promise<any> {
    try {
      const listProductCategry = await Product.findAll({
        where: { categoryId: categoryId },
        raw: true,
      });

      if (!listProductCategry) return null;

      return listProductCategry;
    } catch (error) {
      console.log(error);
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
        ],
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
}
