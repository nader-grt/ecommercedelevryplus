import { Op } from "sequelize";
import { Inventorie, OrderItem, Product, sequelize, Variant } from "../../models/main";
import IVariantProductRepo from "./IVariantProductRepo";


export enum DeleteVariantStatus {
  SOFT_DELETED = "SOFT_DELETED",
  HARD_DELETED = "HARD_DELETED",
  BLOCKED_ORDERS = "BLOCKED_ORDERS",
  BLOCKED_INVENTORY = "BLOCKED_INVENTORY",
  NOT_FOUND = "NOT_FOUND",
}

export interface DeleteVariantResult {
  status: DeleteVariantStatus;
  message: string;
}

export default  class VariantProductRepo extends IVariantProductRepo
{


  // update variant
public async updateVariant(id: number, data: any): Promise<any> {
  const variant = await Variant.findByPk(id);

  if (!variant) return null;

  await variant.update(data);

  return variant;
}

//  delete variant
public async deleteVariant(id: number): Promise<DeleteVariantResult> {
  const t =  await sequelize.transaction();

  try {
    // =========================
    // 1. CHECK VARIANT EXISTS
    // =========================
    const variant = await Variant.findByPk(id, { transaction: t });

    if (!variant) {
      return {
        status: DeleteVariantStatus.NOT_FOUND,
        message: "Variant not found",
      };
    }

    // =========================
    // 2. CHECK ORDERS (CRITICAL BLOCK)
    // =========================
    const orderCount = await OrderItem.count({
      where: { variantId: id },
      transaction: t,
    });

    if (orderCount > 0) {
      return {
        status: DeleteVariantStatus.BLOCKED_ORDERS,
        message: "Cannot delete variant used in orders",
      };
    }

    // =========================
    // 3. CHECK INVENTORY
    // =========================
    const inventoryCount = await Inventorie.count({
      where: { variantId: id },
      transaction: t,
    });

    // =========================
    // 4. SOFT DELETE ALWAYS FIRST
    // =========================
    await variant.update(
      { isDeleted: true },
      { transaction: t }
    );

    // =========================
    // 5. IF INVENTORY EXISTS → KEEP RECORD BUT MARK
    // =========================
    if (inventoryCount > 0) {
      await sequelize.models.Inventorie.update(
        { isArchived: true },
        { where: { variantId: id }, transaction: t }
      );

      await t.commit();

      return {
        status: DeleteVariantStatus.SOFT_DELETED,
        message: "Variant archived (inventory exists)",
      };
    }

    // =========================
    // 6. CLEAN HARD DELETE SAFE DATA
    // =========================
    await t.commit();

    return {
      status: DeleteVariantStatus.SOFT_DELETED,
      message: "Variant soft deleted successfully",
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

//  count variants per product
public async countByProduct(productId: number): Promise<number> {
  return await Variant.count({ where: { productId } });
}


public async isVariantUsed(variantId: number): Promise<boolean> {
  try {

    if (!variantId) {
      throw new Error("variantId is required");
    }

    const count :any = await OrderItem.count({
      where: {
        variantId: variantId
      }
    });

    return (count > 0);

  } catch (error) {
    throw error;
  }
}

public async convertProductToSimple(productId: number): Promise<any> {

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.update({
    type: "SIMPLE"
  });

  return product;
}


//  check duplicate combination
public async findDuplicateCombination(
  productId: number,
  color: string,
  size: string,
  excludeId?: number
): Promise<any> {
  return await Variant.findOne({
    where: {
      productId,
      color,
      size,
      ...(excludeId && { id: { [Op.ne]: excludeId } }),
    },
  });
}

    public async addVariantIfExistInProducts(data:any):Promise<any> 
    {
      const { productId, sku, color, size, price } = data;
            try {
              const product = await Product.findByPk(productId);
              if (!product) {
                throw new Error("Product not found");
              }
          
              // 2️ check SKU uniqueness
              const existingVariant = await this.findBySku(sku);
          
              if (existingVariant) {
                throw new Error("Variant SKU already exists");
              }

              const variant = await Variant.create({
                productId,
                sku,
                color,
                size,
                price,
              });
          
              // 4️return with product ( important for frontend)
              return {
                ...variant.toJSON(),
                product: {
                  id: product.id,
                  name: product.name,
                },
              };
            } catch (error) {
                
            }
    }

    public async findBySku(sku: string): Promise<any> {
      try {
        if (!sku) {
          throw new Error("SKU is required");
        }
    
        const variant = await Variant.findOne({
          where: { sku },
        });
    
        return variant; // null إذا مش موجود
      } catch (error) {
        throw error;
      }
    }
    public async getVariantById(variantId: number): Promise<any> {
        try {
          if (!variantId) {
            throw new Error("variantId is required");
          }
    
     
          const variant = await Variant.findByPk(variantId, {
            attributes: ["id", "sku", "price", "productId"],
      
            include: [
              {
                model:Product,
                as: "product", 
                attributes: ["id", "name", "type", "companyId"]
              },
            ],
          });
    
          if (!variant) {
            throw new Error(`Variant with id ${variantId} not found`);
          }
    
          return variant;
    
        } catch (error) {
          throw error;
        }
      }

      async getVariantById2(variantId: string | number, transaction?: any) {
        return Variant.findOne({
          where: { id: variantId },
          attributes: ["id", "sku", "price", "productId"],
          include: [{
            model: Product,
            as: "product",
            attributes: ["id", "name", "type", "companyId"], // ✅ ضيف هاد
          }],
          transaction,
        });
      }

      public async listVariantsWithProduct({ search, page, perPage }: any):Promise<any> {
        const where: any = {};
      
        if (search) {
          where[Op.or] = [
            {
              sku: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              "$product.name$": {
                [Op.like]: `%${search}%`,
              },
            },
          ];
        }
      
        const { rows, count } = await Variant.findAndCountAll({
          where,
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name"],
            },
          ],
          limit: perPage,
          offset: (page - 1) * perPage,
          distinct: true,
        });
      
        return {
          data: rows,
          total: count,
        };
      }


      public async convertProductToVariable(productId: number): Promise<any> {
        try {
          if (!productId) {
            throw new Error("productId is required");
          }
      
          // 1. get product
          const product: any = await Product.findByPk(productId);
      
          if (!product) {
            throw new Error("Product not found");
          }
      
          // 2. already VARIABLE
          if (product.type === "VARIABLE") {
            return {
              message: "Product already VARIABLE",
              data: product,
            };
          }
      
          // 3. convert
          await product.update({ type: "VARIABLE" });
      
          return {
            message: "Product converted to VARIABLE",
            data: product,
          };
      
        } catch (error: any) {
          console.error("convertProductToVariable error:", error);
          throw error;
        }
      }


      // repo
public async softDeleteVariant(id: number, t?: any): Promise<void> {
  await Variant.update(
    { isDeleted: true },
    { where: { id }, transaction: t }
  );
}

public async countInventory(id: number, t?: any): Promise<number> {
  return await sequelize.models.Inventorie.count({
    where: { variantId: id },
    transaction: t,
  });
}

public async countOrders(id: number, t: any): Promise<number> {
  return await OrderItem.count({
    where: { variantId: id },
    transaction: t,
  });
}
}