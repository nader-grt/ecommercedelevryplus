import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListWareHousesUseCase from "../../useCases/WareHouseUseCase/ListWareHousesUseCase";

export default class ListWareHouseController extends BaseController {
  private _useCase: ListWareHousesUseCase;
  constructor(useCase: ListWareHousesUseCase) {
    super();
    this._useCase = useCase;
  }
  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // React Admin sends query like:
      // ?page=1&perPage=10&sort=id&order=DESC&filter={}

      const { page, perPage, sort, order, filter } = req.query;

      const dto = {
        page: Number(page) || 1,
        perPage: Number(perPage) || 10,
        sort: (sort as string) || "createdAt",
        order: (order as string) || "DESC",
        filter: filter ? JSON.parse(filter as string) : {},
      };


      console.log('********   ',dto, req.query)
      const result = await this._useCase.execute(dto, req.query);

    

      return this.resultValue(res,"list warehouses succefuly",result.data)
    } catch (error: any) {
      console.error("ListWareHouseController Error:", error);
      return this.fail(res, error.message);
    }
  }
}
