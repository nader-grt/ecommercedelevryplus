import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import CreateUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/CreateAddressByAdminUserUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class CreateAddressByAdminUserController extends BaseController {
  private _useCase: CreateUserAddressByAdminUserUseCase;

  constructor(useCase: CreateUserAddressByAdminUserUseCase) {
    super();
    this._useCase = useCase;
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {
      const actor = {
        actorId: req.user?.id,
        actorEmail: req.user?.email,
        actorRole: req.user?.role,
      };

      console.log("actorrrrr ", actor);
      // body من request
      const userAddress = req.body;

      console.log("userAddress");
      // بناء DTO
      const dto: any = {
        actor,
        userAddress,
      };

      console.log("dto ", dto);

      //  call UseCase
      const result = await this._useCase.execute(dto);

      // . response
      return this.ok(res, result);
    } catch (error) {}
  }
}
