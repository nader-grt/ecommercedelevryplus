import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListCompanyUseCase from "../../useCases/companyUseCase/ListCompanyUseCase";

export default class ListCompanyController extends BaseController {
  private listCompanyUseCase: ListCompanyUseCase;

  constructor(listCompanyUseCase: ListCompanyUseCase) {
    super();
    this.listCompanyUseCase = listCompanyUseCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { ids, page, limit } = req.query;

      let filterIds: number[] | undefined;

      if (ids) {
        filterIds = (ids as string)
          .split(",")
          .map((id) => Number(id))
          .filter((id) => !isNaN(id));
      }

      const result = await this.listCompanyUseCase.execute({
        filterIds,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return this.resultValue(res, "Companies fetched successfully", result.data);
    } catch (error: any) {
      return this.fail(res, error.message);
    }
  }
}