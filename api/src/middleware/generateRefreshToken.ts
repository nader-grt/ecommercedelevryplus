import { Role } from "../models/user";
import jwt from "jsonwebtoken";


export async function generateRefreshToken(
    email: string,
    role: Role,
    id: number,
    companyId: number | null
  ): Promise<string> {
    const payload = { email, role, id };
  
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET! as string, {
      expiresIn: "7d",
    });
  }
  