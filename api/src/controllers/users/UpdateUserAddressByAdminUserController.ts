import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import UpdateUserAddressByAdminUserUseCase, { IUpdateUserAddressDTO } from "../../useCases/userUseCase/UpdateUserAddressByAdminUserUseCase";

export default class UpdateUserAddressByAdminUserController extends BaseController {
  private _useCase: UpdateUserAddressByAdminUserUseCase;

  constructor(useCase: UpdateUserAddressByAdminUserUseCase) {
    super();
    this._useCase = useCase;
  }

  
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
      zipCode: data.zipCode || data.zipeCode,
      delegation: data.delegation,
      addressSuplementaire: data.addressSuplementaire,
      userId: data.userId,
    };
  }

  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {
       
      const actor :any = {
        actorId: req.user?.id,
        actorEmail: req.user?.email,
        actorRole: req.user?.role,
      };

  
     // const userAddress = req.body.addresses;
 
      const body = req.body;

  
      const { addresses, userId, ...userData } = body;


      const id = req.params.id;

   

      const dto: IUpdateUserAddressDTO = {
        actor,
        user: {
          userId :Number(id),
          ...userData,
        },
        userAddress: addresses || [],
        
      }; 

   //   console.log("ddddddddddddddd ",dto)
  
       const result = await this._useCase.execute(dto);

       console.log("rrrrrrrrrrr  ",result)
      const formatted = {
        id: result.userId,
        addresses: this.formatAddresses(result.addresses),
      };

      return this.resultValue(res, "user address updated successfully", formatted);

    } catch (error: any) {
      console.error("UpdateUserAddress Error:", error);
      return this.fail(res, error.message || "Unexpected error");
    }
  }
}