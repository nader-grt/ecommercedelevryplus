import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetAllProductsFiltredByCategoryIdUseCase from "../../useCases/productUseCase/GetAllProductsFiltredByCategoryIdUseCase";

interface listProductFiltredDTO
{
   nameProduct:string ;
   priceProdust:number;
   urlImage:string;
   categoryId: number ;
   supplierId: number ;
}

export default class GetAllProductsFiltredByCategoryIdController extends BaseController
{

  async listProduct(products:any[]):Promise<listProductFiltredDTO[] | any>
  {
  //  console.log("pppppppppppppppp ",products)
   return products.map((p) => ({
       nameProduct: p.name,
       priceProdust: p.price,
       urlImage: `${process.env.BASE_URL}/images/${p.nameImage}`,
       categoryId: p.categoryId,
       supplierId: p.supplierId
     }));
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
                          const resultlistProductFiltred :any = await this.listProduct(resultValue.data)

                  console.log("resultlistProductFiltred  ",resultlistProductFiltred)
                    return this.resultValue(res,result.message,{data:resultlistProductFiltred,
                      total:result?.total
                    })
                    
                    } catch (error) {
                        
                    }
        }
}