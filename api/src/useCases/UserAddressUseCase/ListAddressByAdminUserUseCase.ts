import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";

export default class ListAddressByAdminUserUseCase
{
    private _userAddressRepo!:UserAddressRepo;
    private _listuserByAdmincaseUserRepo!: userRepo;
constructor(userAddressRepo:UserAddressRepo,listuserByAdmincaseUserRepo: userRepo)
{


}

       async execute():Promise<any>
       {

           try {
            
           } catch (error) {
            
           }
       }
}