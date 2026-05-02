import bcrypt from "bcrypt";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import ICompanyRepo from "../../repo/CompanyRepo/ICompanyRepo";
import UserAddressDomain from "../../models/domain/UserAddressDomain/UserAddressDomain";

export default class CreateCompanyUseCase {

  private _companyRepo!: ICompanyRepo;
  private _userRepo!: userRepo;

  constructor(companyRepo: ICompanyRepo, userRepo: userRepo) {
    this._companyRepo = companyRepo;
    this._userRepo = userRepo;
  }

  async execute(dto: any) {
    const { company, owner, actor } = dto;

    // ================= SECURITY =================
    if (!actor || actor.role !== "ADMIN") {
      throw new Error("Only ADMIN");
    }

    // ================= CHECK EMAIL =================
    const exist = await this._userRepo.FindUserByEmail(owner.email);
    if (exist) throw new Error("User already exists");

    // ================= PASSWORD =================
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);

    // ================= DOMAIN =================
    const userDomain = new UserAddressDomain(
      {
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phone: owner.phone,
        role: "OWNER",
      },
      owner.addresses
    );

    userDomain.validateUserAndAddresses();

    // ================= CALL REPO =================
    const result = await this._companyRepo.createUserCompanyFullFlow({
      company: {
        name: company.name,
        type: company.type,

        trade_name: company.trade_name,
        tax_number: company.tax_number,
        registration_number: company.registration_number,

        status: company.status || "ACTIVE",
      },
      owner: {
        ...userDomain.getUserData(),
        password: hashed,
        addresses: userDomain.getAddresses(),
      },
    });

    return {
      ...result,
      tempPassword,
    };
  }
}