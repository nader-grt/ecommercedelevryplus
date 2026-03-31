import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";



interface ListInventorieDTO {
    page?: number;
    perPage?: number;
    sortField?: string;
    sortOrder?: "ASC" | "DESC";
    search?: string;
  }

export default class ListInventorieUseCase 
{

  private  _variantProductRepo !:VariantProductRepo 
  private _InventorieRepo!:InventorieRepo
    constructor(inventorieRepo:InventorieRepo,variantProductRepo :VariantProductRepo  )
    {
  this._InventorieRepo = inventorieRepo;
  this._variantProductRepo = variantProductRepo
    }
       async execute(dto?:ListInventorieDTO,notFiltered?: any): Promise<any> {
                       try {
                        
                        const result :any = await this._InventorieRepo.findAllFiltredInventories(dto,notFiltered)  ;

                        console.log("object  inventorieeeee   ",result)
                        if (!result || result.data.length === 0) {
                            return {
                              success: false,
                              message: "No inventorie found",
                              data: [],
                              total: 0,
                            };
                          }
                    
                          return {
                            success: true,
                            message: "inventorie found",
                            data: result.data, //    
                            total: result.total, // 
                          };

                       } catch (error) {
                        console.error("ListInventorieUseCase Error:", error);
                        throw error;
                       }
      }
}