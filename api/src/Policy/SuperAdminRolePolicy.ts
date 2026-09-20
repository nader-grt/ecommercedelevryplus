import { Role } from "../models/user";


export default class SuperAdminRolePolicy {
    static isSuperAdmin(role: Role): boolean {
    return role === Role.SUPERADMIN;
    }
    }