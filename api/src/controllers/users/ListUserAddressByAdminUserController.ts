import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import ListUserAddressByAdminUserUseCase from "../../useCases/userUseCase/ListUserAddressByAdminUserUseCase";
import { verifyRefreshToken } from '../../middleware/verifyRefreshToken';

export default class ListUserAddressByAdminUserController extends BaseController
{

    private _useCase: ListUserAddressByAdminUserUseCase;

    private  transformUsersWithAddresses(users: any[]): any[] {
        if (!users || users.length === 0) return [];
      
        return users.map(user => {
          return {
            ...user,
            addresses: Array.isArray(user.addresses)
              ? user.addresses.map((addr:any) => ({ ...addr }))
              : [],
          };
        });
      }

    constructor(useCase: ListUserAddressByAdminUserUseCase) {
      super();
      this._useCase = useCase;
    }
     protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
                    const page = parseInt(req.query.page as string) || 1;
                    const perPage = parseInt(req.query.perPage as string) || 10;

                    const sort = (req.query.sort as string) || "id";
                    const order = (req.query.order as string) || "ASC";

                       let filter: any = {};
                    try {
                        
                     const result = await this._useCase.execute() ;


      if (!result.success) {
        return this.fail(res, "No users found");
      }

      const usersWithPlainAddresses = this.transformUsersWithAddresses(result.data);

      return this.resultValue(res,"user with address ", usersWithPlainAddresses);
                
                    } catch (error) {
                        
                    }
     }
}