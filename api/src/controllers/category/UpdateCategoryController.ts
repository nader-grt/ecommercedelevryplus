import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateCategoryUseCase from "../../useCases/categoryUseCase/UpdateCategoryUseCase";


 export interface ICategoryRequest 
{
      name:string; 
      categoryId:number;
}


export default class UpdateCategoryController extends BaseController
{

       

       private usecase!:UpdateCategoryUseCase ;
       constructor(updateCategoryUseCase:UpdateCategoryUseCase)
       {super() ;

              this.usecase = updateCategoryUseCase
       }

       protected async executeImpl(req: Request, res: Response): Promise<any> {
        const categoryId = Number(req.params.id);
        const { name } = req.body;
      
        if (!name) {
          return this.conflict(res, "Name is required");
        }
      
        try {
          const result = await this.usecase.execute({ name, categoryId });
      
          if (!result) {
            return this.notFound(res, "Category not found");
          }
      
          return this.resultValue(res, "Category updated successfully", {
            id: result.getCategoryId,
            name: result.getName,
          });
      
        } catch (error) {
          console.log(error);
          return this.fail(res, "Internal error");
        }
      }
}