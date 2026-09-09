import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../models/user";

const publicRoutes = [
  "/api/register",
  "/api/login",
  "/api/refresh-token"
];


export interface RequestAuth extends Request {
    user?: {
      email: string;
      role: Role;
      id: number;
    };
  }

const authentication = (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    req.user = decoded as any;

    return next();

  } catch {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }
};

export default authentication;