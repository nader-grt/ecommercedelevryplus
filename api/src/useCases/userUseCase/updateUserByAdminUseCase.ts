import { ActorUserAdmin } from "../../dbConfig/configApp";
import userDomain from "../../models/domain/auth/user/userDomain";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import { IUpdateUserProfileDTO } from "./UpdateUserProfileUseCase";





  export interface UpdateByAdminData extends IUpdateUserProfileDTO {
    custmerId?: number;
    role?: ActorUserAdmin;
    actor?: ActorUserAdmin;
  }


export default class updateUserByAdminUseCase
{


    private _updateuserByAdmincaseUserRepo!: userRepo;
    constructor(updateusercaseUserRepo: userRepo) {
      this._updateuserByAdmincaseUserRepo = updateusercaseUserRepo;
    }


                 async execute(dto:UpdateByAdminData):Promise<any>
                 {

                              try {
                                


                                console.log("dtttttttttttttttttttooooooooooooooo  ************ ",dto)

                                const user =     await this._updateuserByAdmincaseUserRepo.FindUserByEmail(dto.email)  ;

  

                                console.log("uuuuuuuuuuuu  ",user )//custmerId
                                if(!user)
                                {
                                 return {success:false,message:"user not found"}
                                }
                         
                                const updateUserByAdmin = new userDomain()  ;
                                  
                                updateUserByAdmin.updateByAdmin(dto)

                            //    console.log("updateUserByAdmin   ",updateUserByAdmin  ,"endddddddddddddd  ")
         const userUpdated =      await this._updateuserByAdmincaseUserRepo.updateUserByAdmin({...updateUserByAdmin,
          role:user.role
         } ,Number(dto.custmerId))
                         


                                return {success:true,user:userUpdated}


                              } catch (error) {
                                console.log(error)
                              }

                 }
}