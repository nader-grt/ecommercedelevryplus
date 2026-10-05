import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";

import { RequestAuth } from "../../middleware/verifyToken";

import GetUserByAdminUseCase from "../../useCases/userUseCase/GetUserByAdminUseCase";
import { ActorUserAdmin } from "../../dbConfig/configApp";

interface IGetUser {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city?: string;
  address?: string;
}

export default class GetUserByAdminController extends BaseController {
  async getUser(user: any): Promise<IGetUser> {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      city: user.city,
      address: user.address,
    };
  }




  private _getUserByAdminUseCase!:GetUserByAdminUseCase
  constructor(getUserByAdminUseCase:GetUserByAdminUseCase) {
    super();
    this._getUserByAdminUseCase = getUserByAdminUseCase
  }
  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {

                     try {
      const targetUserId = Number(req.params.id);


          
      const actor: ActorUserAdmin = {
        actorId: Number(req.user!.id),
        actorEmail: req.user!.email,
        actorRole: req.user!.role,
        companyId: req.user!.companyId
      };

      const result = await this._getUserByAdminUseCase.execute({
        userId: targetUserId,
        actor,
      });


      console.log("result factor final  ",result.user  , result )
      if (!result.success) {
        return this.fail(res, result.message);
      }

      return this.resultValue(res, "user fetched", {
        id:result.user[0].id,
        firstName: result.user[0].firstName,
        lastName: result.user[0].lastName,
        email: result.user[0].email,
        phone: result.user[0].phone,
        city: result.user[0].city,
        address: result.user[0].address,
      });
    } catch (err) {
      return this.fail(res, "unexpected error");
    }


  }
}
