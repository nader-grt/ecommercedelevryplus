import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetProfileUserUseCase from "../../useCases/userUseCase/GetProfileUserUseCase";
import { RequestAuth } from "../../middleware/verifyToken";



//GetUserController
export default class GetProfileUserController extends BaseController
{




            private  _getProfileUser!:GetProfileUserUseCase
               constructor(getProfileUserUseCase:GetProfileUserUseCase)
               {super()

                    this._getProfileUser = getProfileUserUseCase
               }
       protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
           

              // const userId = Number(req.user!.id);

              // const result = await this._getProfileUser.execute(userId);

              const userId = Number(req.user!.id);
const companyId = req.user!.companyId;

const result = await this._getProfileUser.execute({
  userId,
  companyId,
});
          
              try {
              if (!result.success) {
                return this.fail(res, result.message);
              }
          
              return this.resultValue(res, "profile  with success ", {
                id : result.user[0].id,
                firstName: result.user[0].firstName,
                lastName: result.user[0].lastName,
                email: result.user[0].email,
                phone: result.user[0].phone,
                role: result.user[0].role,
                companyId: result.user[0].companyId,
              });
            } catch (err) {
              return this.fail(res, "unexpected error");
            }
       }
}