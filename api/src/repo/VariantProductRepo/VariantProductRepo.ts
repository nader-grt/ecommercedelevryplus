import { Op } from "sequelize";
import { OrderItem, Product, Variant } from "../../models/main";
import IVariantProductRepo from "./IVariantProductRepo";




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
public async deleteVariant(id: number): Promise<boolean> {
  const variant = await Variant.findByPk(id);

  if (!variant) return false;

  await variant.destroy();

  return true;
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
                attributes: ["id", "name"],
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
}