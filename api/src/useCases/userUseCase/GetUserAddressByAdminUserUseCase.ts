import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";



export default class GetUserAddressByAdminUserUseCase
{

    private _userAddressRepo: UserAddressRepo;
    private _userRepo: userRepo;
  
    constructor(
      userAddressRepo: UserAddressRepo,
      userRepo: userRepo
    ) {
      this._userAddressRepo = userAddressRepo;
      this._userRepo = userRepo;
    }

      async execute(userId?:number):Promise<any>
      {
                  try {
                    console.log("object  get userId",userId)

                    const user = await this._userRepo.FindUserById(Number(userId))

                    console.log("uuuuuuuuuu ",user)

                    if (!user) {
                        return { success: false, message: "user not found " };
                      } 
                      const result = await this._userAddressRepo.GetUsersWithAddressByAdmin(Number(userId))

                      console.log("rrrrrrrrrr get ",result)
                      if(result.length === 0)
                      {
                        return {success:false,message:"not address by this user"}
                      }
                      return {success:true,data:result}
                  } catch (error) {
                    console.log(error)
                  }
      }
}