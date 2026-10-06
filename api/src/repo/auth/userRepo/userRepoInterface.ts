import IUser from "../../../models/user";
import IUserResponse from "./userRepo";

export default abstract class IUserRepoInterface {
  protected abstract FindUserById(
    userId: number,
    companyId?: number
  ): Promise<IUserResponse | null>;
  //  protected abstract   FindAllUsersByRoleIsUser(role:string):Promise<any> ;
  //  protected abstract CreateUser():Promise<void> ;
  protected abstract DeleteUser(userid?: number): Promise<void>;
  protected abstract updateUser(user: any, userid?: number): Promise<any>;
  protected abstract UpdateRoleUserHasCompany( userId: number, transaction?:any):Promise<any>
  protected abstract  updateUserCompany(userId: number, companyId: number, transaction?: any):Promise<void>
  protected abstract findOwnersWithCompanyAndAddress(): Promise<any[]> 
  protected abstract findByIdSuperAdmin(id: number) : Promise<any> 
}
