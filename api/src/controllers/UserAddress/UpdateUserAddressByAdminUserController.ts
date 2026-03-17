import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import UpdateUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/UpdateUserAddressByAdminUserUseCase";

export default class UpdateUserAddressByAdminUserController extends BaseController
{
      private _updateUserAddressByAdminUserUseCase!:UpdateUserAddressByAdminUserUseCase
      constructor(updateUserAddressByAdminUserUseCase:UpdateUserAddressByAdminUserUseCase)
      {super()
            
      }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
                       
                       try {
                        
                       } catch (error) {
                        
                       }
      }
}