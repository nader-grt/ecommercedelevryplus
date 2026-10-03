
import { Request, Response, NextFunction } from "express";
import { Role } from "../models/user";
import jwt from "jsonwebtoken";
import extractIdFromUser from "./extractIdFromUser";

export interface RequestAuth extends Request {
  user?: {
    email: string;
    role: Role;
    id: number;
    companyId?:number ;
  };
}

export function verifyToken(
  req: RequestAuth,
  res: Response,
  next: NextFunction
): any {
  const headerToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies?.accessToken; // Step 5: 

  const token = headerToken || cookieToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, {
      algorithms: ["HS256"],
    });

    req.user = {
      email: decoded.email,
      role: decoded.role,
      id: decoded.id,
      companyId: decoded.companyId
    };

    extractIdFromUser(decoded.id);
    next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
      });
    }

    return res.status(401).json({
      message: "Invalid access token",
    });
  }
}



























// import { Request, Response, NextFunction } from "express";
// import { Role } from "../models/user";
// import jwt from "jsonwebtoken";
// import extractIdFromUser from "./extractIdFromUser";

// export interface RequestAuth extends Request {
//   user?: {
//     email: string;
//     role: Role;
//     id: number;
//   };
// }

// export function verifyToken(
//   req: RequestAuth,
//   res: Response,
//   next: NextFunction
// ): any {
//   const authHeader = req.headers.authorization;


//   const headerToken = req.headers.authorization?.split(" ")[1];
//   const cookieToken = req.cookies?.refreshToken;

//   const token = headerToken || cookieToken;

// console.log("token verfy token step 2 ",token)

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access Denied. No token provided" });
//   } // ACCESS_TOKEN_SECRET  befor use JWT_SECRET

//   try {
//     const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

//     req.user = {
//       email: decoded.email,
//       role: decoded.role,
//       id: decoded.id,
//     };

//     // console.log("222222222222222222222222",   req.user  ,"333333333333333333333   ",decoded.id )
//     extractIdFromUser(decoded.id);
//     next();
//   } catch (err: any) {
//     if (err?.name === "TokenExpiredError") {
//       return res.status(401).json({
//         message: "Access token expired",
//       });
//     }

//     return res.status(401).json({
//       message: "Invalid access token",
//     });
//   }
// }
