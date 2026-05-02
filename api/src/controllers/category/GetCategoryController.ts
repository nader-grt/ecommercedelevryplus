import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetCategoryUseCase from "../../useCases/categoryUseCase/GetCategoryUseCase";






export default class GetCategoryController extends BaseController
{
    
      private usecase!:GetCategoryUseCase
       constructor(getCategoryUseCase :GetCategoryUseCase  )
       {super() ;

           
              this.usecase = getCategoryUseCase ;
       }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
          const {id} = req.params ;
            const  categoryId :number = Number(id)
            console.log("categoryId    ",categoryId)
                      try {

                    
                    
                                        
                   const      resultCategory =   await     this.usecase.execute(Number(categoryId))
                        if(resultCategory)
                        {
                              return this.resultValue(res," find category by success ",{ id: resultCategory.categoryId,
                                    name: resultCategory.name,
                                   })// products: resultCategory.products
                        }else
                        {
                              return this.notFound(res,"not found category ")
                        }
                      } catch (error) {
                        console.log(error)
                      }
      }
}