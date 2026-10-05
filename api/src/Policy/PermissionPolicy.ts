import { Permission } from "./Permission";
import { Role } from "../models/user";
import OwnerRolePolicy from "./OwnerRolePolicy";

export default class PermissionPolicy {
  static hasPermission(
    role: Role,
    permission: Permission
  ): boolean {
    if (role === Role.OWNER) {
      return OwnerRolePolicy
        .getPermissions()
        .includes(permission);
    }

    return false;
  }
}