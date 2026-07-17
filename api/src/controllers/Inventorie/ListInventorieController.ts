import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListInventorieUseCase from "../../useCases/InventorieUseCase/ListInventorieUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class ListInventorieController extends BaseController {

  private _usecase!: ListInventorieUseCase
  constructor( usecase: ListInventorieUseCase) {
    super()
    this._usecase = usecase
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {
      const { page, perPage, sort, order, filter } = req.query;

      const dto = {
        page: Number(page) || 1,
        perPage: Number(perPage) || 10,
        sort: (sort as string) || "createdAt",
        order: (order as string) || "DESC",
        filter: filter ? JSON.parse(filter as string) : {},
      };

      const result = await this._usecase.execute(dto, req.user);

      // 
      return this.ok(res,result)

    } catch (error: any) {
      console.error("ListInventorieController Error:", error);
      return this.fail(res, error.message);
    }
  }
}