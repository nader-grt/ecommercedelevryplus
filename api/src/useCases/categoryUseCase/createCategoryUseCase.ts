import CategoryDomain from "../../models/domain/cetegoryDomain/CategoryDomaun";
import CategoryRepo, { ICategoryRepo } from "../../repo/categoryRepo/categoryRepo";


export default class CreateCategoryUseCase {



             constructor(private categoryRepo : CategoryRepo)
             {

             }

             async execute(name: string): Promise<CategoryDomain | any> {


              console.log("object  ",name)
                if (!name || name.trim().length === 0) {
                  throw new Error("Invalid category name");
                }
            
                      try {
                              
                const categoryDomain  = new CategoryDomain();
                categoryDomain.setName = name;
            
                const createdCategory = await this.categoryRepo.createCategory(categoryDomain);

                return createdCategory;
                      } catch (error) {
                        
                        console.log(error)
                      }
            
                
              }

}