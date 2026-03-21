import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/ListAddressByAdminUserUseCase";

export default class ListAddressByAdminUserController extends BaseController {
  private _listUserAddressByAdminUserUseCase!: ListUserAddressByAdminUserUseCase;
  constructor(
    listUserAddressByAdminUserUseCase: ListUserAddressByAdminUserUseCase
  ) {
    super();
    this._listUserAddressByAdminUserUseCase = listUserAddressByAdminUserUseCase;
  }
  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      await this._listUserAddressByAdminUserUseCase.execute;
    } catch (error) {}
  }
}
