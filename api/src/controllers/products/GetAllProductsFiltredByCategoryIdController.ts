import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetAllProductsFiltredByCategoryIdUseCase from "../../useCases/productUseCase/GetAllProductsFiltredByCategoryIdUseCase";

interface listProductFiltredDTO
{ id: number;
   name:string ;
   price:number;
   urlImage:string;
   type: string;
   categoryId: number ;
   supplierId: number ;
}

interface ProductVariantDTO {
  id: number;
  name: string;
  price: number;
  urlImage: string;
  categoryId: number;
  supplierId: number | null;
  type: string;
  variants: any[];
}



export default class GetAllProductsFiltredByCategoryIdController extends BaseController
{

  async listProduct(products:any[]):Promise<listProductFiltredDTO[] | any>
  {
  //  console.log("pppppppppppppppp ",products)
   return products.map((p) => ({
       id:p.id,
       name: p.name,
       price: p.price,
       type:p.type,
       urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
       categoryId: p.categoryId,
       supplierId: p.supplierId
     }));
  }


  // private listProductVariants(products: any[]): ProductVariantDTO[] {

  //   console.log("pppppppppppppp  ",products)
  //   return products.map((p) => ({
  //     id: p.id,
  //     nameProduct: p.name,
  //     priceProduct: p.price,
  //     urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
  //     categoryId: p.categoryId,
  //     supplierId: p.supplierId,
  //     type: p.type,
  
  //     variants: p.variants || [],
  //   }));
  // }

  private listProductVariants(products: any[]): ProductVariantDTO[] {
    const map = new Map<number, ProductVariantDTO>();
  
    for (const p of products) {
      //  If product not added yet
      if (!map.has(p.id)) {
        map.set(p.id, {
          id: p.id,
          name: p.name,
          price: p.price,
          urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
          categoryId: p.categoryId,
          supplierId: p.supplierId,
          type: p.type,
          variants: [],
        });
      }
  
      // Add variant if exists
      if (p.variants && p.variants.id) {
        map.get(p.id)!.variants.push({
          id: p.variants.id,
          productId: p.variants.productId,
          sku: p.variants.sku,
          color: p.variants.color,
          size: p.variants.size,
          price: p.variants.price,
        });
      }
    }
  
    return Array.from(map.values());
  }
                private _getAllProductsFiltredByCategoryIdUseCase!:GetAllProductsFiltredByCategoryIdUseCase
                      constructor(getAllProductsFiltredByCategoryIdUseCase:GetAllProductsFiltredByCategoryIdUseCase)
                      {super()

                        this._getAllProductsFiltredByCategoryIdUseCase = getAllProductsFiltredByCategoryIdUseCase
                      }

        protected async executeImpl(req: Request, res: Response): Promise<any> {
                    

                    const page = parseInt(req.query.page as string) || 1;
                    const perPage = parseInt(req.query.perPage as string) || 10;

                    const sort = (req.query.sort as string) || "id";
                    const order = (req.query.order as string) || "ASC";

                    let filter: any = {};
                    try {


                      filter = req.query.filter
                      ? JSON.parse(req.query.filter as string)
                      : {};
                        const notfiltred :any = req.query ;
                    
                    
                        const params = {
                            page,
                            perPage,
                            sort,
                            order,
                            filter
                        };


                        console.log("ppppppp ",params)
                      const result =         await         this._getAllProductsFiltredByCategoryIdUseCase.execute(params ,notfiltred)

                
                      const resultValue :any = {
                       data: result?.data,
                       total: result?.total
                       }
                    if(!result.success)
                    {
                         const resultFailed : any = {
                          //   message : result.message,
                            data: result?.data,
                       total: result?.total
                         }
                        return this.resultValue(res,resultFailed)


                    }

                        //  const resultlistProductFiltred :any = await this.listProduct(resultValue.data)

                          const resultlistProductVariantsFiltred :any = await this.listProductVariants(resultValue.data)

                    return this.resultValue(res,result.message,{data:resultlistProductVariantsFiltred,
                      total:result?.total
                    })
                    
                    } catch (error) {
                        
                    }
        }
}