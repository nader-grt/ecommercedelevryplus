import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import CreateUserAddressByAdminUserUseCase from "../../useCases/userUseCase/CreateUserAddressByAdminUserUseCase";

export default class CreateUserAddressByAdminUserController extends BaseController {
  private _useCase: CreateUserAddressByAdminUserUseCase;


  private formatAddresses(addresses: any) {
  
    if (Array.isArray(addresses)) {
      return addresses.map((addr: any) => this.mapAddress(addr));
    }
  
 
    if (addresses?.data && Array.isArray(addresses.data)) {
      return addresses.data.map((addr: any) => this.mapAddress(addr));
    }
  
    return [];
  }
  
  private mapAddress(addr: any) {
 
    const data = addr?.dataValues ? addr.dataValues : addr;
  
    return {
      id: data.id,
      street: data.street,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode || data.zipeCode, //  
      userId: data.userId,
    };
  }
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
      // body  request
      const userAddress = req.body;

      console.log("userAddress");
     
      const dto: any = {
        actor,
        userAddress,
      };

      console.log("dto ", dto);

      //  call UseCase
     const result = await this._useCase.execute(dto);

     console.log("rrrrrrrrrrrrrrr  create" ,result)
     const formatted = {
      id: result.userId,
      addresses: this.formatAddresses(result.addresses),
    };
    
    return this.resultValue(res, "user created with succuss",formatted);
    } catch (error) {}
  }
}
