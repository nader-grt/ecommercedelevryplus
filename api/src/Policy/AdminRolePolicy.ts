import { Role } from "../models/user";


export default class AdminRolePolicy
{


    static canBeAdmin(role: Role): boolean {


        console.log("rrrrrrolleeeeeeeee  ",role)
        if (role === Role.ADMIN.toLocaleLowerCase())
        {
            return true;
        }
       return false;
      }

  
        static isAdmin(role: Role): boolean {
          return role === Role.ADMIN;
        }
      

}