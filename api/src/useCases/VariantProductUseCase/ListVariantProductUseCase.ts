import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class ListVariantProductUseCase {
  private _variantRepo: VariantProductRepo;

  constructor(variantRepo: VariantProductRepo) {
    this._variantRepo = variantRepo;
  }

  async execute(query: any): Promise<any> {
    try {
      const { search, page = 1, perPage = 10 } = query;

      const result = await this._variantRepo.listVariantsWithProduct({
        search,
        page: Number(page),
        perPage: Number(perPage),
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}