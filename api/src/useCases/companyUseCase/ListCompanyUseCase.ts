import { Request, Response } from "express";
import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";


export default class ListCompanyUseCase
{

      private _listCompanyRepo! :ICompanyRepo
      constructor(listCompanyRepo :ICompanyRepo)
      {
            this._listCompanyRepo = listCompanyRepo
      }
      async execute(filterIds?: number[]): Promise<any> {
              try {
                  // if (params) {
                  //       const { page, limit } = params;
                    
                  //       const offset = (page - 1) * limit;
                    
                  //       return await this.companyRepo.findAllPaginated(limit, offset);
                  //     }
                    
                        const listCompanies  =  await    this._listCompanyRepo.findAll();
                       if(listCompanies.length === 0)
                       {
                        return {success:false,message:"no cmpanies yes"}
                       }
                      
                       return {success:true,data:listCompanies}
              } catch (error) {
                
              }
     }
}