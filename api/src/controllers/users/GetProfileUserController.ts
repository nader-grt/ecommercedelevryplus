import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetProfileUserUseCase from "../../useCases/userUseCase/GetProfileUserUseCase";
import { RequestAuth } from "../../middleware/verifyToken";
import { ActorUserAdmin } from "../../dbConfig/configApp";

//GetUserController
export default class GetProfileUserController extends BaseController {
  private _getProfileUser!: GetProfileUserUseCase;
  constructor(getProfileUserUseCase: GetProfileUserUseCase) {
    super();

    this._getProfileUser = getProfileUserUseCase;
  }
  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    const userId = Number(req.user!.id);

    const actor: ActorUserAdmin = {
      actorId: Number(req.user!.id),
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      companyId: req.user!.companyId,
    };

    const result = await this._getProfileUser.execute({
      userId,
      actor,
    });

    try {
      if (!result.success) {
        return this.fail(res, result.message);
      }

      const user = Array.isArray(result.user) ? result.user[0] : result.user;

      return this.resultValue(res, "profile with success", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
      });
    } catch (err) {
      console.log(err);

      return this.fail(res, "unexpected error");
    }
  }

  // protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
  //   // const userId = Number(req.user!.id);

  //   // const result = await this._getProfileUser.execute(userId);

  //   const userId = Number(req.user!.id);

  //   const actor: ActorUserAdmin = {
  //     actorId: Number(req.user!.id),
  //     actorEmail: req.user!.email,
  //     actorRole: req.user!.role,
  //     companyId: req.user!.companyId,
  //   };

  //   const result = await this._getProfileUser.execute({
  //     userId,
  //     actor,
  //   });

  //   try {
  //     if (!result.success) {
  //       return this.fail(res, result.message);
  //     }

  //     return this.resultValue(res, "profile  with success ", {
  //       id: result.user[0].id,
  //       firstName: result.user[0].firstName,
  //       lastName: result.user[0].lastName,
  //       email: result.user[0].email,
  //       phone: result.user[0].phone,
  //       role: result.user[0].role,
  //       companyId: result.user[0].companyId,
  //     });
  //   } catch (err) {
  //     return this.fail(res, "unexpected error");
  //   }
  // }
}
