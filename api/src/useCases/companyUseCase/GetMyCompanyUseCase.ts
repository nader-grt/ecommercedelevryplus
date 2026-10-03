import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";

export default class GetMyCompanyUseCase {
    constructor(private readonly companyRepo: ICompanyRepo) {}
  
    async execute(companyId: number) {
      const company = await this.companyRepo.findById(companyId);
  
      if (!company) {
        throw new Error("Company not found");
      }
  
      return company;
    }
  }