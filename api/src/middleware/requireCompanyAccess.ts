import { Request, Response, NextFunction } from "express";
import { RequestAuth } from "./verifyToken";

export const requireCompanyAccess = (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const requestedCompanyId = Number(req.params.id);

  if (!requestedCompanyId || Number.isNaN(requestedCompanyId)) {
    return res.status(400).json({
      message: "Invalid company ID",
    });
  }

  // SUPERADMIN has platform-level access
  if (user.role === "SUPERADMIN") {
    return next();
  }

  // Other users must belong to a company
  if (!user.companyId) {
    return res.status(403).json({
      message: "User is not associated with a company",
    });
  }

  // User can only access their own company
  if (Number(user.companyId) !== requestedCompanyId) {
    return res.status(403).json({
      message: "You do not have access to this company",
    });
  }

  return next();
};