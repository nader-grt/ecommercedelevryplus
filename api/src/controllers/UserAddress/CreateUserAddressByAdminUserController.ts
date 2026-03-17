import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/CreateUserAddressByAdminUserUseCase";

export default class CreateUserAddressByAdminUserController extends BaseController
{
          private _createUserAddressByAdminUserUseCase!:CreateUserAddressByAdminUserUseCase
      constructor(createUserAddressByAdminUserUseCase:CreateUserAddressByAdminUserUseCase)
      {super()

      }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
          
             try {
                  
             } catch (error) {
                  
             }
      }
}
