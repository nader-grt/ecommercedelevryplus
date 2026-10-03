import { Request, Response, NextFunction } from "express";
import { RequestAuth } from "./verifyToken";

export const requireCompanyUser = (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (
    req.user.role !== "ADMIN" &&
    req.user.role !== "OWNER"
  ) {
    return res.status(403).json({
      message: "Forbidden: company access required",
    });
  }

  if (!req.user.companyId) {
    return res.status(403).json({
      message: "User is not associated with a company",
    });
  }

  return next();
};