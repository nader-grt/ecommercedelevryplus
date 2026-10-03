import ICompanySettingsRepo, {
    ICompanySettingsUpdate,
  } from "../../repo/CompanySettingsRepo/ICompanySettingsRepo";
  
  export default class UpdateCompanySettingsUseCase {
    constructor(
      private readonly companySettingsRepo: ICompanySettingsRepo
    ) {}
  
    async execute(
      companyId: number,
      data: ICompanySettingsUpdate,
      userId: number
    ) {
      const existing =
        await this.companySettingsRepo.findByCompanyId(
          companyId
        );
  
      if (!existing) {
        throw new Error("Company settings not found");
      }
  
      const {
        companyId: _ignoredCompanyId,
        id: _ignoredId,
        createdBy: _ignoredCreatedBy,
        updatedBy: _ignoredUpdatedBy,
        createdAt: _ignoredCreatedAt,
        updatedAt: _ignoredUpdatedAt,
        ...safeData
      } = data as any;
  
      return await this.companySettingsRepo.update(
        companyId,
        {
          ...safeData,
          updatedBy: userId,
        }
      );
    }
  }
















// import ICompanySettingsRepo, { ICompanySettingsUpdate } from "../../repo/CompanySettingsRepo/ICompanySettingsRepo";



// export default class UpdateCompanySettingsUseCase {
//   constructor(
//     private readonly companySettingsRepo: ICompanySettingsRepo
//   ) {}

//   async execute(
//     companyId: number,
//     data: ICompanySettingsUpdate,
//     userId: number
//   ) {
//     const existing =
//       await this.companySettingsRepo.findByCompanyId(
//         companyId
//       );

//     if (!existing) {
//       throw new Error("Company settings not found");
//     }

//     return await this.companySettingsRepo.update(
//       companyId,
//       {
//         ...data,
//         updatedBy: userId,
//       }
//     );
//   }
// }