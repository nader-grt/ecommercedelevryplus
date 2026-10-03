import ICompanySettingsRepo from "../../repo/CompanySettingsRepo/ICompanySettingsRepo";

export default class GetCompanySettingsUseCase {
  constructor(
    private readonly companySettingsRepo: ICompanySettingsRepo
  ) {}

  async execute(companyId: number):Promise<any> {

    console.log("usecase companySettings is \t  ",companyId)
    const settings =
      await this.companySettingsRepo.findByCompanyId(
        companyId
      );


      console.log(" is setting is ## \t\t\t ",settings)
    if (!settings) {
      throw new Error("Company settings not found");
    }

    return settings;
  }
}