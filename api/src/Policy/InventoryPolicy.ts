export class InventoryPolicy {
    static canAccess(user: any, companyId: number) {
      if (user.role === "ADMIN") return;
  
      if (user.role === "OWNER" && user.companyId === companyId) return;
  
      throw new Error("Forbidden");
    }
  }