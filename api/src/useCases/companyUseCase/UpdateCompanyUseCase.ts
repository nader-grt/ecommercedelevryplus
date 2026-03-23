import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";

 interface UpdateCompanyDTO {
      id: number;
      name?: string;
      type?: "SHOP" | "WAREHOUSE" | "HYBRID";
      isActive?: boolean;
    }

export default class UpdateCompanyUseCase {
  private companyRepo: ICompanyRepo;

  constructor(companyRepo: ICompanyRepo) {
    this.companyRepo = companyRepo;
  }

  async execute(dto: UpdateCompanyDTO) {
    const { id, name, type, isActive } = dto;

    if (!id) {
      throw new Error("Company id is required");
    }

    if (!name && !type && isActive === undefined) {
      throw new Error("No data provided to update");
    }

    if (type && !["SHOP", "WAREHOUSE", "HYBRID"].includes(type)) {
      throw new Error("Invalid company type");
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive ? 1 : 0;
    }

    const updatedCompany = await this.companyRepo.update(id, updateData);

    return {
      id: updatedCompany.id,
      name: updatedCompany.name,
      type: updatedCompany.type,
      isActive: Boolean(updatedCompany.isActive),
    };
  }
}