import ProductRepo from "../../repo/productRepo/productRepo";

interface IProductsFiltredByCategoryIdDTO {

    page:number;
    perPage:number;
    sort:string;
    order:string;
    filter:any ;
}

export default class GetAllProductsFiltredByCategoryIdUseCase
{


             private _useCaseproductRepo!:ProductRepo;
           
             constructor(usecaseProductRepo:ProductRepo)
             {
              this._useCaseproductRepo = usecaseProductRepo ;
             
             }
             async execute(dto:IProductsFiltredByCategoryIdDTO ,notfiltred:any):Promise<any>
             {
                   try {

                    const { page, perPage, sort, order, filter } = dto;
                 //   console.log({ page, perPage, sort, order, filter } ,"dtooooooooo  ",dto)
                    

                 //  const result =         await this._useCaseproductRepo.getAllProductsFiltred(dto,notfiltred)

                   const result =         await this._useCaseproductRepo.getAllProductVariantsFiltred(dto,notfiltred)
               //    console.log("rrrrrrrrrrrr  ",result)
                   if (result.data.length === 0) {

                    return {
                        success:false ,
                        message: "No products found",
                        data: [],
                        total: 0,
                      };
               
                  } 

                  return {
                    success:true ,
                    message: "Products found",
                    data: result.data,
                    total: result.total,
                  };
                  
                  
                  
                   } catch (error) {
                    
                   }
             }
}