import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import DeleteUserAddressByAdminUseCase from "../../useCases/UserAddressUseCase/DeleteUserAddressByAdminUseCase";

export default class DeleteUserAddressByAdminController extends BaseController
{

        private _deleteUserAddressByAdminUseCase!:DeleteUserAddressByAdminUseCase
      constructor(deleteUserAddressByAdminUseCase:DeleteUserAddressByAdminUseCase)
      {super()
            
      }
      protected async executeImpl(req: Request, res: Response): Promise<any> {
                  try {
                        
                  } catch (error) {
                        
                  }
      }
}