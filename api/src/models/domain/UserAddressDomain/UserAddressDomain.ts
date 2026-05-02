
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
type UserDataDTO = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  role?:string;
};


export default class UserAddressDomain extends userDomain {
  private addresses: Address[] = [];

  constructor(userData?:UserDataDTO, addressesData?: any) {
    super();
    if (userData) {
      console.log("constructorrrrrrrr  ",userData,"connnnnn")
     this.setOptionalUserData(userData);
    }
    if (addressesData && addressesData.length > 0) {
      this.addresses = addressesData.map((addr:any) => ({ ...addr }));
    }
  }

  // ================= Optional fields handling =================
  private setOptionalUserData(data:UserDataDTO) {
    console.log("dddddddddddddddddddddddddd fn  ",data ,"fn insiiiiiiide   ",data)
    if (data.firstName !== undefined)
      this.setFirstName = data.firstName;
  
    if (data.lastName !== undefined)
      this.setLastName = data.lastName;
  
    if (data.email !== undefined)
      this.setEmail = data.email;
  
    if (data.phone !== undefined)
      this.setPhone = data.phone;
  
    if (data.city !== undefined)
      this.setCity = data.city;
  
    // default role
   // this.setRole = "USER";
    this.setRole = data.role;
  }

  // ================= Addresses management =================
  public addAddress(address: Address) {
    if (!address.street) throw new Error("Street is required");
    if (!address.city) throw new Error("City is required");

    if (!address.country) address.country = "Tunis"; // default

    this.addresses.push(address);
  }



  public getAddresses() {
    return this.addresses;
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
      if (!addr.street) throw new Error("Street required");
      if (!addr.city) throw new Error("City required");
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
      role: this.getRole || "USER",
    };
  }
}