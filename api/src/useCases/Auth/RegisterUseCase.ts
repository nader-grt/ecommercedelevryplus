import { userRepo } from "../../repo/auth/userRepo/userRepo";
import userDomain from "../../models/domain/auth/user/userDomain";
import { Role } from "../../models/user";
import { Company } from '../../models/Company';

// ما فماش role في الـ input: النوع نفسو يمنع أي واحد يمرر role
export interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  companyId: number | null;
}

export type RegisterResult =
  | { status: "EMAIL_EXISTS" }
  | {
      status: "CREATED";
      user: { id: number; firstName: string; lastName: string; email: string; role: Role ;  companyId: number | null;};
    };

export default class RegisterUseCase {
  private readonly _userRepo: userRepo;

  constructor(repo: userRepo = new userRepo()) {
    this._userRepo = repo;
  }

  async execute(input: RegisterInput): Promise<RegisterResult> {
    if (await this._userRepo.IsExistUser(input.email)) {
      return { status: "EMAIL_EXISTS" };
    }

    const hashedPassword = await userDomain.hashPassword(input.password);

    try {
      const saved = await this._userRepo.registerUser({
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        password: hashedPassword,
        role: Role.USER, // القاعدة هنا، مش في الـ client ولا في الـ controller
      });

      return {
        status: "CREATED",
        user: {
          id: saved.id,
          firstName: saved.firstName,
          lastName: saved.lastName,
          email: saved.email,
          role: saved.role,
          companyId:saved.companyId
        },
      };
    } catch (error: any) {
      // requestين متزامنين بنفس الـ email: الـ unique index يرفض الثاني
      if (error?.name === "SequelizeUniqueConstraintError") {
        return { status: "EMAIL_EXISTS" };
      }
      throw error; // أي خطأ آخر يوصل للـ controller ويرجع 500
    }
  }
}