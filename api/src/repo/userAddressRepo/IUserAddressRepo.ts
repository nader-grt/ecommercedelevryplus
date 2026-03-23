import { Address } from "../../models/Address";




export default abstract class IUserAddressRepo
{

    protected abstract createUserWithAddresses(userId: number, addressUser: any) :Promise<Address | any> ;

    protected abstract createAddress(address: any): Promise<Address> ;
      
     
       protected abstract findAddressByUserId(userId: number): Promise< any>;
       protected abstract ListUsersWithAddressByAdmin():Promise<any>;
       protected abstract GetUsersWithAddressByAdmin(userId?:number):Promise<any>;
       protected abstract replaceUserAddresses(userId: number,  addresses: any[]): Promise<any> ;
       protected abstract updatedUserAddresses(userId: number, userInfo :any, addresses: any[]): Promise<any> ;
}