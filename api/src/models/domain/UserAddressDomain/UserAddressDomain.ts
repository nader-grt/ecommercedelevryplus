
import userDomain from "../auth/user/userDomain";

export interface Address {
    id?: number;                
    userId?: number;           
    street: string;             
    city?: string;              
    country?: string;           
    zipCode?: string;           
    delegation?: string;        
    addressSupplementaire?: string; 
  }

/**
 userId:number ;
zipeCode:number;
street:string;
delegation:string;
addressSuplementaire:string;
 */

export default class UserAddressDomain extends userDomain {
  private addresses: Address[] = [];

  constructor(userData?: Partial<userDomain>, addressesData?: Address[]) {
    super();
    if (userData) {
      this.setOptionalUserData(userData);
    }
    if (addressesData && addressesData.length > 0) {
      this.addresses = addressesData.map(addr => ({ ...addr }));
    }
  }

  // ================= Optional fields handling =================
  private setOptionalUserData(data: Partial<userDomain>) {
    if (data.getFirstName) this.setFirstName = data.getFirstName;
    if (data.getLastName) this.setLastName = data.getLastName;
    if (data.getEmail) this.setEmail = data.getEmail;
    if (data.getPhone) this.setPhone = data.getPhone;
    if (data.getCity) this.setCity = data.getCity;
  }

  // ================= Addresses management =================
  public getAddresses(): Address[] {
    return this.addresses;
  }

  public addAddress(address: Address) {
    if (!address.street) {
      throw new Error("Address must have a street field");
    }
    address.userId = this.getId;
    this.addresses.push(address);
  }

  public removeAddress(addressId: number) {
    // قد تقتصر على Admin فقط حسب سياستك
    this.addresses = this.addresses.filter(addr => addr.id !== addressId);
  }

  // ================= Validation rules =================
  public validateUserAndAddresses() {
    if (!this.addresses || this.addresses.length === 0) {
      throw new Error("User must have at least one address");
    }
    this.addresses.forEach(addr => {
      if (!addr.userId) {
        addr.userId = this.getId;
      }
    });
  }


  // ================= Utilities =================
  public getUserData() {
    return {
      firstName: this.getFirstName,
      lastName: this.getLastName,
      email: this.getEmail,
      phone: this.getPhone,
      city: this.getCity,
      role: this.getRole,
    };
  }
}