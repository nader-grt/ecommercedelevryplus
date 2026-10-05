import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestAuth } from "./verifyToken";

export function verifyRefreshToken(
  req: RequestAuth,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.cookies?.refreshToken;
  console.log("Refresh token from cookie:ininallll 0 ", refreshToken  , "\n ");
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing"
    });
  }

  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      companyId: decoded.companyId
    };

   // console.log("reqqqqqqqq  user ",req.user)
    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid or expired refresh token"
    });

  }
}