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

  
  private   formatUserResponse = (data: any) => {
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
  
      addresses: (data.addresses || []).map((addr: any) => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipeCode, // mapping
        delegation: addr.delegation,
        addressSuplementaire: addr.addressSuplementaire,
      })),
    };
  };


  protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    try {
       
      const actor :any = {
        actorId: req.user?.id,
        actorEmail: req.user?.email,
        actorRole: req.user?.role,
      };

  
 
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

  
        const result = await this._useCase.execute(dto);

  //  console.log("rrrrrrrrrrr  ",result)
     
    const dataResult :any = this.formatUserResponse(result.data)

       return this.resultValue(res, "user address updated successfully", dataResult);

    } catch (error: any) {
      console.error("UpdateUserAddress Error:", error);
      return this.fail(res, error.message || "Unexpected error");
    }
  }
}