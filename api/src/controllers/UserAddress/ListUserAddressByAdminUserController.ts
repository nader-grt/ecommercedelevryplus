import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ListUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/ListUserAddressByAdminUserUseCase";

export default class ListUserAddressByAdminUserController extends BaseController
{

      private _listUserAddressByAdminUserUseCase!:ListUserAddressByAdminUserUseCase
      constructor(listUserAddressByAdminUserUseCase:ListUserAddressByAdminUserUseCase)
      {super()
            
      }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
                        try {
                              
                        } catch (error) {
                              
                        }
      }
}