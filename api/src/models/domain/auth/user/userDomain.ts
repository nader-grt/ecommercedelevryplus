import bcrypt from "bcrypt";
import  { Role } from "../../../user";
import IUserResponse from "../../../../repo/auth/userRepo/userRepo";

import { IUpdateUserProfileDTO } from "../../../../useCases/userUseCase/UpdateUserProfileUseCase";
import { UpdateByAdminData } from "../../../../useCases/userUseCase/updateUserByAdminUseCase";
import { ActorUserAdmin } from "../../../../dbConfig/configApp";





type actorRole =
  | Role
  | ActorUserAdmin;


export default class userDomain {
  protected id?: number;
  protected _firstName: string = "";
  protected _lastName: string = "";
  protected _phone: string = "";
  protected _email: string = "" ;
  protected password?: string = "";
  protected role?: any | string ;
  protected city?: string;
  protected address?: string;

  constructor() {}


  public get getId(): number | undefined {
    return this.id;
  }

  public get getFirstName(): string {
    return this._firstName;
  }

  public get getLastName(): string {
    return this._lastName;
  }

  public get getPhone(): string {
    return this._phone;
  }

  public get getEmail(): string {
    return this._email;
  }

  public get getPassword(): string | undefined {
    return this.password;
  }

  public get getRole(): string | any {
    return this.role?.toLowerCase();
  }

  public get getCity(): string | undefined {
    return this.city;
  }

  public get getAddress(): string | undefined {
    return this.address;
  }

  // ======== SETTERS =========

  public set setFirstName(firstName: string) {
    this._firstName = firstName;
  }

  public set setLastName(lastName: string) {
    this._lastName = lastName;
  }

  public set setPhone(phone: string) {
    this._phone = phone;
  }

  public set setEmail(email: string) {
    this._email = email;
  }

  public async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    if (!plainPassword || !hashedPassword) return false;
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  public static async setPasswordHashed(password: string) {
    await userDomain.hashPassword(password);

    //this.password = password;
  }

  public set setPassword(password: string) {
    const pass: any = userDomain.hashPassword(password);
    this.password = pass;
  }

  public set setRole(role: any) {
    this.role = role.toLowerCase();
  }

  public set setCity(city: string) {
    this.city = city;
  }

  public set setAddress(address: string) {
    this.address = address;
  }

  public static async hashPassword(valuePassword: string): Promise<any> {
    if (valuePassword) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(valuePassword, saltRounds);
      // = hashedPassword;
      return hashedPassword;
    }
  }

  public toGetAllUsers(data?: any): IUserResponse[] {
 
    const users: IUserResponse[] = data.map((user: IUserResponse) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
     //   city: user.city,
       // address: user.address,
      };
    });
    return users;
  }




        public updateProfileUser(data: IUpdateUserProfileDTO): void {
          //  extends  {
          this._firstName = data.firstName;
          this._lastName = data.lastName;
          this._email = data.email;
          this._phone = data.phone;
        //  this.city = data.city;
          //this.address = data.address;
        }
  
              public updateByAdmin(data: UpdateByAdminData): void {

              // console.log("data  adminnnnnnn  ",data)
                this.updateProfileUser(data);
              
                if (data.role) {
                  this.role = data.role;
                }
              }
}
