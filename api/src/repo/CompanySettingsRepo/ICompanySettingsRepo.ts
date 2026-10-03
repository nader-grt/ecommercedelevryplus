import { Transaction } from "sequelize";
// import {
//   ICompanySettings,
//   ICompanySettingsCreation,
//   ICompanySettingsUpdate,
// } from "../../models/CompanySettings";


export interface ICompanySettings {
    id: number;
    companyId: number;
  
    currency: string;
    language: string;
    timezone: string;
    taxRate: number;
  
    logoCompany?: string | null;
    addressCompany?: string | null;
    phoneCompany?: string | null;
    emailCompany?: string | null;
  
    isActive: boolean;
  
    createdBy?: number | null;
    updatedBy?: number | null;
  
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ICompanySettingsCreation {
    companyId: number;
  
    currency?: string;
    language?: string;
    timezone?: string;
    taxRate?: number;
  
    logoCompany?: string | null;
    addressCompany?: string | null;
    phoneCompany?: string | null;
    emailCompany?: string | null;
  
    isActive?: boolean;
  
    createdBy?: number | null;
    updatedBy?: number | null;
  }
  
  export interface ICompanySettingsUpdate {
    currency?: string;
    language?: string;
    timezone?: string;
    taxRate?: number;
  
    logoCompany?: string | null;
    addressCompany?: string | null;
    phoneCompany?: string | null;
    emailCompany?: string | null;
  
    isActive?: boolean;
  
    updatedBy?: number | null;
  }




export default interface ICompanySettingsRepo {
  findByCompanyId(
    companyId: number
  ): Promise<ICompanySettings | null>;

  create(
    data: ICompanySettingsCreation,
    transaction?: Transaction
  ): Promise<ICompanySettings>;

  update(
    companyId: number,
    data: ICompanySettingsUpdate,
    transaction?: Transaction
  ): Promise<ICompanySettings>;
}