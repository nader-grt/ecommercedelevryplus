import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";



export default class ListUserAddressByAdminUserUseCase 
{

    private _userAddressRepo: UserAddressRepo;
  
  
    constructor(
      userAddressRepo: UserAddressRepo
   
    ) {
      this._userAddressRepo = userAddressRepo;
    
    }

          async execute():Promise<any>
          {
               try {
                

            const result =     await this._userAddressRepo.ListUsersWithAddressByAdmin() ;

            console.log("result listt ",result)

            if(result[0].length === 0)
            {
                return {success:false,messahe:"user no address "}
            }

            return {success:true,data:result}
               } catch (error) {
                  console.log(error)
               }
          }
}