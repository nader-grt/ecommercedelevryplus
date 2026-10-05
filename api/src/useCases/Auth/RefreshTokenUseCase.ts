import jwt from "jsonwebtoken";
import crypto from "crypto";
import generateAccessToken from "../../middleware/generateAccessToken";
import { generateRefreshToken } from "../../middleware/generateRefreshToken";
import RefreshTokenRepo from "../../repo/auth/userRepo/RefreshTokenRepo";

export default class RefreshTokenUseCase {
  private _refreshTokenRepo = new RefreshTokenRepo();

  async execute(refreshToken: string) {
    try {
      console.log("step 3 usecasee ", refreshToken);

      const hash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const tokenRecord = await this._refreshTokenRepo.findToken(hash);

      console.log("tokenRecord 6 ", tokenRecord);
      if (!tokenRecord) return { success: false, message: "Token not found" };
      if (tokenRecord.revoked)
        return { success: false, message: "Token revoked" };

      const payload: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );

      const { email, role, id ,companyId} = payload;

      const newAccessToken = await generateAccessToken(email, role, id,companyId);
      const newRefreshToken = await generateRefreshToken(email, role, id ,companyId);

      const newHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");
      await this._refreshTokenRepo.revokeToken(hash); //
      await this._refreshTokenRepo.createToken(
        id,
        newHash,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );

      return {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (err) {
      return { success: false, message: "Invalid or expired refresh token" };
    }
  }
}
