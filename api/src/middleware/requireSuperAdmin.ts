import { Request, Response, NextFunction } from "express";
import SuperAdminRolePolicy from "../Policy/SuperAdminRolePolicy";
import { RequestAuth } from "./verifyToken";


export function requireSuperAdmin(req: RequestAuth, res: Response, next: NextFunction) {
  const role = req.user?.role; // set earlier by your authenticate middleware

  if (!role) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  if (!SuperAdminRolePolicy.isSuperAdmin(role)) {
    return res.status(403).json({ message: "Forbidden — SUPERADMIN only" });
  }

  next();
}