import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";

export default class DeleteAddressByAdminUseCase
{

        private _userAddressRepo!:UserAddressRepo;
        private _deleteuserByAdmincaseUserRepo!: userRepo;
        constructor(userAddressRepo:UserAddressRepo,deleteuserByAdmincaseUserRepo: userRepo)
        {


        }

       async execute():Promise<any>
       {

           try {
            
           } catch (error) {
            
           }
       }
}