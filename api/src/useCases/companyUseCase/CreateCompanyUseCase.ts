import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";

export interface CreateCompanyDTO {
  name: string;
  type?: "SHOP" | "WAREHOUSE" | "HYBRID";
  isActive?: boolean;
}

export default class CreateCompanyUseCase {
  private companyRepo: ICompanyRepo;

  constructor(companyRepo: ICompanyRepo) {
    this.companyRepo = companyRepo;
  }

  async execute(dto: CreateCompanyDTO) {
    const { name, type = "SHOP", isActive = true } = dto;

    // Validation
    if (!name) {
      throw new Error("Company name is required");
    }

    if (!["SHOP", "WAREHOUSE", "HYBRID"].includes(type)) {
      throw new Error("Invalid company type");
    }

    //  Transform for DB
    const data :any = {
      name,
      type,
      isActive: isActive ? 1 : 0,
    };

    const company = await this.companyRepo.createCompany(data);

    // Return clean object (React Admin friendly)
    return {
      id: company.id,
      name: company.name,
      type: company.type,
      isActive: Boolean(company.isActive),
    };
  }
}