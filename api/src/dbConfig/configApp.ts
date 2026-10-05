import crypto from "crypto";


export const refreshTokenSecret = crypto.randomBytes(32).toString("hex");




export  const BASE_URL = process.env.BASE_URL; // http://localhost:4000

export type ActorUserAdmin = {
    actorId: number;
    actorEmail: string | undefined;
    actorRole: string | any;
    companyId: number | null;
  };
  
//   export const actorUserAdmin: ActorUserAdmin = {
//     actorId: 1,
//     actorEmail: "admin@example.com",
//     actorRole: "admin",
//   };
  