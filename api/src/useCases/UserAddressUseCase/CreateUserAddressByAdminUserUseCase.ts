import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";


export default class CreateUserAddressByAdminUserUseCase
{
           private _userAddressRepo!:UserAddressRepo;
           private _createuserByAdmincaseUserRepo!: userRepo;
       constructor(userAddressRepo:UserAddressRepo,createuserByAdmincaseUserRepo: userRepo)
       {


       }

       async execute():Promise<any>
       {

           try {
            
           } catch (error) {
            
           }
       }
}

//      