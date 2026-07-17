export default class ListInventorieUseCase {
  
  
  
  constructor(private inventoryRepo: any) {}

  async execute(dto: any, user: any): Promise<any> {
    try {
      // ================================
      // 1. BUILD FILTER (BUSINESS LOGIC)
      // ================================
      const filter: any = dto.filter || {};

      //  OWNER → يشوف فقط شركته
      if (user.role === "OWNER") {
        filter.companyId = user.companyId;
      }

      //  ADMIN → يشوف الكل (no restriction)

      const query = {
        page: dto.page,
        perPage: dto.perPage,
        sort: dto.sort,
        order: dto.order,
        filter,
      };

      // ================================
      // 2. FETCH DATA
      // ================================
      const result = await this.inventoryRepo.findAllFiltered(query);

      // ================================
      // 3. EMPTY CASE (Business friendly)
      // ================================
      if (!result.data.length) {
        return {
          data: [],
          total: 0,
        };
      }

      // ================================
      // 4. RETURN (React Admin Format)
      // ================================
      return {
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      console.error("ListInventorieUseCase Error:", error);
      throw error;
    }
  }
}