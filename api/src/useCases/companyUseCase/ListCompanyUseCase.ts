import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";

interface ListCompanyDTO {
  filterIds?: number[];
  page?: number;
  limit?: number;
}

export default class ListCompanyUseCase {
  private companyRepo: ICompanyRepo;

  constructor(companyRepo: ICompanyRepo) {
    this.companyRepo = companyRepo;
  }

  async execute(dto: ListCompanyDTO): Promise<any> {
    try {
      const { filterIds, page, limit } = dto;

      // =========================
      // CASE 1: PAGINATION MODE
      // =========================
      if (page && limit) {
        const result = await this.companyRepo.findAllPaginated!(
          page,
          limit
        );

        return {
          success: true,
          mode: "paginated",
          ...result,
        };
      }

      // =========================
      // CASE 2: FILTER BY IDS
      // =========================
      const companies = await this.companyRepo.findAll(filterIds);

      
      if (!companies || companies.length === 0) {
        return {
          success: true,
          message: "No companies found",
          data: [],
        };
      }


      console.log("ccccccccccccccccccccc  companies ",companies)
      return {
        success: true,
        mode: "list",
        data: companies,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to list companies");
    }
  }
}