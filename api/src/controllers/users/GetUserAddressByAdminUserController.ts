import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetUserAddressByAdminUserUseCase from "../../useCases/userUseCase/GetUserAddressByAdminUserUseCase";

export default class GetUserAddressByAdminUserController extends BaseController {
  private _useCase: GetUserAddressByAdminUserUseCase;

  constructor(useCase: GetUserAddressByAdminUserUseCase) {
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
      userId: data.userId,
      delegation: data.delegation || "",
      addressSuplementaire: data.addressSuplementaire || "",
    };
  }

  private transformSingleUserWithAddresses(users: any[]): any {
    if (!users || users.length === 0) return null;
  
    const user = users[0]; // ناخذ أول عنصر فقط
  console.log("uuuuuuuuuuuuuuuuu  ",user)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
  
      addresses: Array.isArray(user.addresses)
        ? user.addresses.map((addr: any) => ({
            id: addr.id,
            street: addr.street,
            city: addr.city,
            country: addr.country,
            zipCode: addr.zipeCode, // ⚠️ مهم (مش zipCode)
            delegation: addr.delegation,
            addressSuplementaire: addr.addressSuplementaire,
          }))
        : [],
    };
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const {id} = req.params; // 
const userId = Number(id)
      console.log("GET USER ADDRESSES FOR:", userId);

      const result = await this._useCase.execute( userId);

   

      const formatted = this.transformSingleUserWithAddresses(result.data);

      return this.resultValue(res, "user addresses fetched successfully", formatted);
    } catch (error) {
      console.error(error);
      return this.fail(res, "error fetching user addresses");
    }
  }
}