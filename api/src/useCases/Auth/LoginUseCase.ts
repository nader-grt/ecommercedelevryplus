import generateAccessToken from "../../middleware/generateAccessToken";
import { generateRefreshToken } from "../../middleware/generateRefreshToken";
import userDomain from "../../models/domain/auth/user/userDomain";
import RefreshTokenRepo from "../../repo/auth/userRepo/RefreshTokenRepo";
import crypto from "crypto";
import { userRepo } from "../../repo/auth/userRepo/userRepo";

interface ILoginDTO {
  email: string;
  password: string;
}

export default class LoginUseCase {
  private _loginUserRepo!: userRepo;
  private _userDomain: userDomain = new userDomain();
  private _refreshTokenRepo = new RefreshTokenRepo();
  constructor(loginUserRepo: userRepo) {
    this._loginUserRepo = loginUserRepo;
  }

  async execute(dto: ILoginDTO): Promise<any> {
    try {
      console.log("dtoooooooo login ", dto);

      const user = await this._loginUserRepo.FindUserByEmailLogin(dto.email);
       console.log("uuuuuuuuuuuu  ",user)

      if (!user) {
        return { success: false, message: "user not found  " };
      }

      //  console.log("this._userDomain  ",this._userDomain)

      console.log("aaaaaa  ", dto.password,
        user.password)
      const isMatch = await this._userDomain.comparePassword(
        dto.password,
        user.password
      );

      //   console.log("  isMatch  ",isMatch)
      if (!isMatch) {
        return { success: false, message: "Invalid credentials " };
      }


      const accessToken = await generateAccessToken(
        user.email,
        user.role,
        user.id
      );

      const refreshToken = await generateRefreshToken(
        user.email,
        user.role,
        user.id
      );

      const hash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      await this._refreshTokenRepo.createToken(
        user.id,
        hash,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //
      );
      return {
        success: true,
        data: {
          accessToken,
          refreshToken, //
          user: { id: user.id, email: user.email, role: user.role },
        },
      };
    } catch (error: any) {
      console.log("eee ", error);
    }
  }
}
