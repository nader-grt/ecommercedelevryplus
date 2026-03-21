import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";

export default class UpdateAddressByAdminUserUseCase
{
    private _userAddressRepo!:UserAddressRepo;
    private _updateuserByAdmincaseUserRepo!: userRepo;
        constructor(userAddressRepo:UserAddressRepo,updateuserByAdmincaseUserRepo: userRepo)
        {


        }

       async execute():Promise<any>
       {

           try {
            
           } catch (error) {
            
           }
       }
}