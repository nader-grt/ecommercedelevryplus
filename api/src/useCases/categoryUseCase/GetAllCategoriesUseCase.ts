import { promises } from "dns";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";




export default class GetAllCategoriesUseCase
{


             private usecaseRepo!:CategoryRepo; 
         constructor(categoryRepo:CategoryRepo)
         {
              this.usecaseRepo = categoryRepo ;
         }


         async execute(filterIds?: number[]):Promise<any>
         {

              try {
                const categoriesName =      await this.usecaseRepo.GetAllCategories(filterIds)  ;
              console.log("categoriesName categoriesName ",categoriesName)
                return categoriesName ;
              } catch (error) {
                
                  console.log(error)
              }
         }

}