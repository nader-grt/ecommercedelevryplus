import { userRepo } from "../../repo/auth/userRepo/userRepo";

export default class GetCompanyOwnersUseCase {
  private _userRepo!: userRepo;

  constructor(userRepo: userRepo) {
    this._userRepo = userRepo;
  }

  async execute(): Promise<any[]> {
    const owners = await this._userRepo.findOwnersWithCompanyAndAddress();

    console.log("ooooooooooooooo  ",owners)
    return owners.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      email: user.email,

      company: user.company
        ? {
            id: user.company.id,
            name: user.company.name,
            type: user.company.type,
            status: user.company.status, //  FIXED
          }
        : null,

      addressesCount: user.addresses?.length || 0,
      addresses: user.addresses || [],
    }));
  }
}