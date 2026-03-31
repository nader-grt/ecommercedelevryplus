import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetAllCategoriesUseCase from "../../useCases/categoryUseCase/GetAllCategoriesUseCase";



export default class GetAllCategoriesController extends BaseController
{


   
  private usecase!:GetAllCategoriesUseCase;
       constructor(getAllCategoriesUseCase:GetAllCategoriesUseCase)
       {super() ;

             
              this.usecase = getAllCategoriesUseCase
       }

    protected async executeImpl(req: Request, res: Response): Promise<any> {
        

       const { ids } = req.query; // query param

       console.log("idsss ",ids)
      
       let filterIds: number[] | undefined;
       if (ids) {
         filterIds = (ids as string).split(',').map(Number);
       }
                try {
                       const categoriesName =      await this.usecase.execute(filterIds)  ;


                               if(filterIds)
                               {
                                console.log("777777777777777777777777777777777777777777777")
                                return this.resultValue(res," category with success ",categoriesName) ;
                               }
                       if(categoriesName.length === 0)
                       {
                        return this.notFound(res,"empty catygories ") ;
                       }

                       const formattedCategories = categoriesName.map((cat: any) => ({
                            id: cat.categoryId,
                            name: cat.name,
                          }));
                    
                     //      return res.json({
                     //        data: formattedCategories,
                     //        total: formattedCategories.length
                     //      });

                       return this.resultValue(res,"all categories ",formattedCategories) ;
                } catch (error) {
                    console.log(error)
                }
    }
}