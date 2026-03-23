import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { ActorUserAdmin } from "../../dbConfig/configApp";
import IAddress from "../../models/Address";

export interface IUpdateUserAddressDTO {
  actor: ActorUserAdmin;
user:{
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role:string;
},
  userAddress: {
 
    addresses: IAddress[];
  };
}

export default class UpdateUserAddressByAdminUserUseCase {
  private _userAddressRepo: UserAddressRepo;
  private _userRepo: userRepo;

  constructor(
    userAddressRepo: UserAddressRepo,
    userRepo: userRepo
  ) {
    this._userAddressRepo = userAddressRepo;
    this._userRepo = userRepo;
  }

  async execute(data: IUpdateUserAddressDTO): Promise<any> {

    const { actor, userAddress,user } = data;

    console.log("dataaaaa usecase ",data)
    let userId: number | undefined;

    try {
      if (actor.actorRole === "USER") {
        userId = actor.actorId;
      
      } else if (actor.actorRole === "ADMIN") {
      
        if (!data.user?.userId) {
          throw new Error("userId is required for admin update");
        }
      
        userId = data.user.userId;
      
      } else {
        throw new Error("Unauthorized");
      }

      if (!Array.isArray(userAddress) || userAddress.length === 0) {
        throw new Error("Addresses are required");
      }

      const user = await this._userRepo.FindUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

   
      //console.log("uuuusecase s ", userId,  data?.user?.userId, userAddress,"  usecase end  ")
        const result:any =  await this._userAddressRepo.updatedUserAddresses(Number(data?.user.userId), data.user, userAddress)
    

      //console.log("rrrrrrrrrr22222222222222 ",result)

// 


  return {success:true,data:result.data
   
  }
     
   

    } catch (error) {
      console.error("UpdateUserAddress UseCase Error:", error);
      throw error;
    }
  }
}