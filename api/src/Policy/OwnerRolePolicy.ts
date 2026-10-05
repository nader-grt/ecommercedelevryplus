import { Permission } from "./Permission";
import { Role, Scope } from "../models/user";

export default class OwnerRolePolicy {
  static isOwner(role: Role): boolean {
    return role === Role.OWNER;
  }

  static getPermissions(): Permission[] {
    return [
      Permission.USERS_VIEW,
      Permission.USERS_CREATE,
      Permission.USERS_UPDATE,
      Permission.USERS_DELETE,
      Permission.USERS_ASSIGN_ROLE,
    ];
  }

  static getScope(): Scope {
    return Scope.COMPANY;
  }
}