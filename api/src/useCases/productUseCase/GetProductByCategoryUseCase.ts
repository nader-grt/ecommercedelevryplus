import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import ProductRepo from "../../repo/productRepo/productRepo";



interface GetProductCategoryDTO
{
    categoryId:number;
}


export default class GetProductByCategoryUseCase
{

               private _useCaseproductRepo!:ProductRepo;
               private _usecaseCategoryRepo!:CategoryRepo
               constructor(usecaseProductRepo:ProductRepo ,usecaseCategoryRepo:CategoryRepo)
               {
                this._useCaseproductRepo = usecaseProductRepo ;
                this._usecaseCategoryRepo = usecaseCategoryRepo ;
               }


              async  execute(dto:GetProductCategoryDTO):Promise<any>
              {
                        

                      console.log("ddddddddddddd  ",dto)

                                   
                           try {
                                           
                                       let category =           await this._usecaseCategoryRepo.GetCategoryById(Number(dto.categoryId)) ;

                                       if(!category)
                                       {
                                        return { success: false, message: "category not found" };
                                       }


                             
                          
                               const listProducts = await this._useCaseproductRepo.getProductsByCategoryWithVariants(Number(dto.categoryId))

                               console.log(" listProducts listProducts ******** ",listProducts)
                               return { success: true, data: listProducts ,category:category};

                           } catch (error) {
                            console.log(error)
                           }

              }
}