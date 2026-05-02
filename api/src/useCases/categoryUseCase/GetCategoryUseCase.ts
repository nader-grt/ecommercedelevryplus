import CategoryDomain from "../../models/domain/cetegoryDomain/categoryDomain";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";




export default class GetCategoryUseCase  
{

        private usecaseRepo:CategoryRepo
    constructor( categoryRepo:CategoryRepo)
    {
        this.usecaseRepo = categoryRepo 
    }
      
    async execute(id:number):Promise<any>
    {


       
              try {
                           
                const resultCategory :any = await this.usecaseRepo.GetCategoryById(id) ;

               console.log("result usecaseee  ",resultCategory)

                return resultCategory ;
              } catch (error) {
                console.log(error)
              }
    }
}