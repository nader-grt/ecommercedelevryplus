import { userRepo } from "../../repo/auth/userRepo/userRepo";
interface IGetProfileUser {
  userId: number;
  companyId: number | null;
}
export default class GetProfileUserUseCase {
  private _usecaseUseRepo!: userRepo;
  constructor(useusecaseuser: userRepo) {
    this._usecaseUseRepo = useusecaseuser;
  }
  async execute(dto: IGetProfileUser): Promise<any> {
    try {
      if (!dto.companyId) {
        return {
          success: false,
          message: "User is not associated with a company",
        };
      }
      const user = await this._usecaseUseRepo.FindUserById(
        dto.userId,
        dto.companyId
      );
      console.log("step profile ", user);
      if (!user) {
        return { success: false, message: "user not found" };
      }
      return { success: true, user: user };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Server error" };
    }
  }
}

//import { userRepo } from "../../repo/auth/userRepo/userRepo";

// export default class GetProfileUserUseCase
// {
//     private _usecaseUseRepo!: userRepo;
//     constructor(useusecaseuser: userRepo) {
//       this._usecaseUseRepo = useusecaseuser;
//     }

//     async execute(userId: number): Promise<any>
//     {

//          try {

//             const user = await this._usecaseUseRepo.FindUserById(userId);

//             console.log("step profile  ",user)
//             if (!user) {
//               return { success: false, message: "user not found " };
//             }

//             return { success: true, user: user };

//          } catch (error) {
//             console.log(error)
//          }

//       }
// }
