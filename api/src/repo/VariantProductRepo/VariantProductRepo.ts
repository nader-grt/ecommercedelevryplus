import { Op } from "sequelize";
import { Product, Variant } from "../../models/main";
import IVariantProductRepo from "./IVariantProductRepo";




export default  class VariantProductRepo extends IVariantProductRepo
{


    public async addVariantIfExistInProducts():Promise<any> 
    {
            try {
                
            } catch (error) {
                
            }
    }
    public async getVariantById(variantId: number): Promise<any> {
        try {
          if (!variantId) {
            throw new Error("variantId is required");
          }
    
          // const variant = await Variant.findByPk(variantId, {
          //   attributes: ["id", "sku", "price", "productId"],
    
          //   // OPTIONAL: include relations if needed
          //   // include: [{ model: Product, attributes: ["id", "name"] }],
          // });
          const variant = await Variant.findByPk(variantId, {
            attributes: ["id", "sku", "price", "productId"],
      
            include: [
              {
                model:Product,
                as: "product", // لازم تكون معرفة في العلاقات
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
}