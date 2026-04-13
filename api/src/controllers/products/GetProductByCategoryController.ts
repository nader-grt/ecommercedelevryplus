import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetProductByCategoryUseCase from "../../useCases/productUseCase/GetProductByCategoryUseCase";

 interface listProductDTO
 {
    nameProduct:string ;
    priceProdust:number;
    urlImage:string;
 }

export default class GetProductByCategoryController  extends BaseController
{
           async listProduct(products:any[]):Promise<listProductDTO[] | any>
           {
            return products.map((p) => ({
                nameProduct: p.name,
                priceProdust: p.price,
                urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
              }));
           }

           async listProductWithVariant(products: any[]): Promise<any[]> {
            const map = new Map<number, any>();
          
            products.forEach((p) => {
              // 🔹 إذا product مش موجود نعمل create
              if (!map.has(p.id)) {
                map.set(p.id, {
                  id: p.id,
                  nameProduct: p.name,
                  priceProdust: p.price,
                  type: p.type,
                  urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
                  variants: [],
                });
              }
          
              const product = map.get(p.id);
          
              // 🔹 نضيف variant إذا موجود
              if (p.variants && p.variants.id) {
                product.variants.push({
                  id: p.variants.id,
                  sku: p.variants.sku,
                  color: p.variants.color,
                  size: p.variants.size,
                  price: Number(p.variants.price),
                });
              }
            });
          
            return Array.from(map.values());
          }
           private _usecasegetProductByCategory!:GetProductByCategoryUseCase
           constructor(usecasegetProductByCategory:GetProductByCategoryUseCase)
           {super()
             this._usecasegetProductByCategory = usecasegetProductByCategory ;
           }

           protected async executeImpl(req: Request, res: Response): Promise<any> {
               
                    const {categoryid} = req.params

                       try {
                        

                        const result =       await this._usecasegetProductByCategory.execute({
                                categoryId :Number(categoryid)
                               })

                               if(!result.success)
                               {
                                return this.fail(res,result.message)
                               }


                               console.log(" result final   ",result.data)

                               const resultListProducts  =   await this.listProductWithVariant(result.data)
                               return this.resultValue(res,"products ",{category :result.category,products:resultListProducts})
                       } catch (error) {
                          console.log(error)
                       }
           }
}