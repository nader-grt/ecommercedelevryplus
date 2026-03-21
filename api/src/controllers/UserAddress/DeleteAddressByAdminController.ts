import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import DeleteUserAddressByAdminUseCase from "../../useCases/UserAddressUseCase/DeleteAddressByAdminUseCase";

export default class DeleteAddressByAdminController extends BaseController {
  private _deleteUserAddressByAdminUseCase!: DeleteUserAddressByAdminUseCase;
  constructor(
    deleteUserAddressByAdminUseCase: DeleteUserAddressByAdminUseCase
  ) {
    super();
    this._deleteUserAddressByAdminUseCase = deleteUserAddressByAdminUseCase;
  }
  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      await this._deleteUserAddressByAdminUseCase.execute;
    } catch (error) {}
  }
}
