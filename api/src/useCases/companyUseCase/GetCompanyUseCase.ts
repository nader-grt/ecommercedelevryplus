import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";

export interface GetCompanyDTO {
      id: number;
    }

export default class GetCompanyUseCase
{

      private _getCompanyRepo! :ICompanyRepo
      constructor(getCompanyRepo :ICompanyRepo)
      {
            this._getCompanyRepo = getCompanyRepo
      }
      async execute(dto:GetCompanyDTO): Promise<any> {
              try {
                

             const company =     await    this._getCompanyRepo.findById(Number(dto.id))

             if(company === null)
             {
                  return {success:false,message:"company not found"}
             }

             return {success:true,data:company}
              } catch (error) {
                
              }
     }
}