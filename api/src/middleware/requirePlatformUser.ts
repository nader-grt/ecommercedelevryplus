import { Response, NextFunction } from "express";
import { RequestAuth } from "./verifyToken";

export const requirePlatformUser = (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "SUPERADMIN") {
    return res.status(403).json({
      message: "Forbidden: platform access required",
    });
  }

  return next();
};