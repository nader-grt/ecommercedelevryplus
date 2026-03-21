import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/UpdateAddressByAdminUserUseCase";

export default class UpdateAddressByAdminUserController extends BaseController {
  private _updateUserAddressByAdminUserUseCase!: UpdateUserAddressByAdminUserUseCase;
  constructor(
    updateUserAddressByAdminUserUseCase: UpdateUserAddressByAdminUserUseCase
  ) {
    super();
    this._updateUserAddressByAdminUserUseCase =
      updateUserAddressByAdminUserUseCase;
  }
  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      await this._updateUserAddressByAdminUserUseCase.execute;
    } catch (error) {}
  }
}
