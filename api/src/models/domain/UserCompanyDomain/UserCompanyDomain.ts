export interface Address {
    street: string;
    city: string;
    country?: string;
    zipCode?: string;
    delegation?: string;
    addressSupplementaire?: string;
  }
  
  export interface CreateOwnerUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  
    companyId: number;
  
    addresses: Address[];
  }
  
  export default class UserCompanyDomain {
    private user: any;
    private addresses: Address[] = [];
  
    constructor(data: CreateOwnerUserDTO) {
      this.user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
  
        // 🔥 FIXED RULE
        role: "OWNER",
        companyId: data.companyId,
      };
  
      this.addresses = data.addresses || [];
    }
  
    public getUser() {
      return this.user;
    }
  
    public getAddresses() {
      return this.addresses;
    }
  }