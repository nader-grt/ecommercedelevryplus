

import { userRepo } from "../../repo/auth/userRepo/userRepo";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { ActorUserAdmin } from "../../dbConfig/configApp";
import UserAddressDomain from "../../models/domain/UserAddressDomain/UserAddressDomain";
import bcrypt  from 'bcrypt';
import IAddress from "../../models/Address";

export interface IUserWithAddressDTO {
    actor: ActorUserAdmin;
  
    userAddress: {
      userId?: number;
  
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      role?:string;
  
      addresses: IAddress[];
    };
  }

export default class CreateUserAddressByAdminUserUseCase
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
       async execute(data:IUserWithAddressDTO):Promise<any>
       {
                    const { actor, userAddress } = data;
                     
                           
                    console.log("dddddddddddddddddd ",data ,"11123 123   ",{ actor, userAddress } )
                    let userId: number | undefined;
                    let isCreatingUser = false;

           try {
            
            if (actor.actorRole === "user") {
                userId = actor.actorId;
              }
          
              // ================= ADMIN =================
              else if (actor.actorRole === "admin") {
          
                if (userAddress.userId) {
                  userId = userAddress.userId;
                } else {
                  isCreatingUser = true;
                }
          
              } else {
                throw new Error("Unauthorized");
              }
          
              // ================= VALIDATION =================
          
              if (!userAddress.addresses || userAddress.addresses.length === 0) {
                throw new Error("Addresses are required");
              }


                const userData:any =      {
                    // id: userId,
                     firstName: userAddress.firstName,
                     lastName: userAddress.lastName,
                     email: userAddress.email,
                     phone: userAddress.phone,
                     role:userAddress.role
                   //  city: userAddress.addresses[0]?.city || "DefaultCity",
                 } ;

                 const [firstAddress] = userAddress.addresses;
console.log("userData ",userData ,"firstAddress ",firstAddress)

                 //{ street, city, country }
                 const userDomainInstance = new UserAddressDomain(
                    userData,
                    [firstAddress]
                  );
    

                  console.log(" userDomainInstance  ",userDomainInstance)
          //  userDomainInstance.validateUserAndAddresses();
    
     
  //  console.log("////// ",userDomainInstance.getUserData())
          

  
  if (isCreatingUser) {
    const randomPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    console.log("aaaaaaaaaaaaaaaaaaaaaaa ",{
        ...userDomainInstance.getUserData(),
        password: hashedPassword
      },"            nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn ")
    const newUser = await this._userRepo.registerUser({
      ...userDomainInstance.getUserData(),
      password: hashedPassword
    });
  
    console.log("newUser newUser ",newUser)
    userId = newUser.id;
}


userDomainInstance.getAddresses().forEach(addr => {
    addr.userId = userId;
});
    
             const result = await this._userAddressRepo.createUserWithAddresses(userId,userDomainInstance.getAddresses());
    

             console.log( typeof result , "object 888888 ",result)
            return {
                userId,
                addresses: result,
            };
    

           } catch (error) {
            
           }
       }
}

//      