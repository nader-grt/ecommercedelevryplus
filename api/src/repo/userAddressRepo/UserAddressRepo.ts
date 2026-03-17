import sequelize from "../../dbConfig/config";
import IUserAddressRepo from "./IUserAddressRepo";




export default class UserAddressRepo extends IUserAddressRepo
{

    // we have an repo 
  // ================= Transaction-friendly creation =================
//   public async createUserWithAddresses(userInfo: any, addressUser: any) {
//     // userInfo: وظيفة إنشاء المستخدم في الريبو/DB
//     // addressUser: وظيفة إنشاء العنوان في الريبو/DB
//     this.validateUserAndAddresses();

//     const transaction = await createUserFn.startTransaction?.();

//     try {
//       const user = await createUserFn({ ...this.getUserData() }, { transaction });

//       for (const addr of this.addresses) {
//         await createAddressFn({ ...addr, userId: user.id }, { transaction });
//       }

//       await transaction?.commit?.();
//       return user;
//     } catch (err) {
//       await transaction?.rollback?.();
//       throw err;
//     }
//   }


public async createUserWithAddresses(userInfo: any, addressUser: any) :Promise<any> 
{
                      const t = await sequelize.transaction(); //
                              try {
                                
                              } catch (error) {
                                
                              }
}
}
