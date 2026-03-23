import { Request, Response } from "express";
import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";

export interface DeleteCompanyDTO {
      name: string;
      type?: "SHOP" | "WAREHOUSE" | "HYBRID";
    }

export default class DeleteCompanyUseCase
{

      private _deleteCompanyRepo! :ICompanyRepo
      constructor(deleteCompanyRepo :ICompanyRepo)
      {
            this._deleteCompanyRepo = deleteCompanyRepo
      }
      async execute(dto:DeleteCompanyDTO): Promise<any> {
              try {
                
              } catch (error) {
                
              }
     }
}