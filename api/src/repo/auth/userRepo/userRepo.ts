import { User } from "../../../models/main";
import IUser, { Role } from "../../../models/user";
import IUserRepoInterface from "./userRepoInterface";

export default interface IUserResponse {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  role?: Role;
  //city?: string;
  //address?: string;
}

export interface IUserRegister {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  role?: Role;
  //city?: string;
//  address?: string;
}

export class userRepo extends IUserRepoInterface {
  public async DeleteUser(userId: number): Promise<any | null> {
    try {
      const user: any | null = await User.destroy({
        where: { id: userId },
      });

      if (user === null) return null;
      return user
    } catch (error) {
      console.log(error);
    }
  }

  public async FindUserByEmailLogin(email: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: { email: email },
        raw: true,
      });
      if (!user) return null;

      // return {

      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   phone: user.phone,
      //   email: user.email,
      //   role: user.role,
      //   city: user.city,
      //   address: user.address,
      // }

      return user
    } catch (error) {
      console.log(error);
    }
  }


  public async FindUserByEmail(email: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: { email: email },
        raw: true,
      });
      if (!user) return null;

      return {

        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
      //  city: user.city,
       // address: user.address,
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async FindUserById(id: number): Promise<IUserResponse | any> {
    try {
      const resultUser = await User.findByPk(id);

      if (!resultUser) return null;

      const user = resultUser.get({ plain: true }) as IUserResponse;
      return user ? [user] : null;
    } catch (error) {
      console.log(error);
    }
  }

  public  async FindAllUsersByRoleIsUser(role: string): Promise<any> {
    const listUsers = await User.findAll({ where: { role: role } });

    try {
      if (!listUsers.length) return [];

      const users = listUsers.map((user) => user.get({ plain: true })).map(user => {
                return {
                    id:user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  phone: user.phone,
                  email: user.email,
                  role: user.role,
                //  city: user.city,
                 // address: user.address,
                }
      });
 
    //  return users as IUserResponse[];
    return users
    } catch (error) {
      console.log(error);
    }
  }

  public static async existUserId(id: number): Promise<boolean | undefined> {
    try {
      const user: IUserResponse | null = await User.findOne({
        where: { id: id },
        raw: true,
      });

      if (!user || user === undefined) return false;
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateUser(user: IUserResponse, userid?: number): Promise<any> {
    try {
      const u: any = await User.update(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        //  address: user.address,
        },
        {
          where: { id: userid },
        }
      );

      if (!u) return null;
      return u;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateUserByAdmin(user: any, userid?: number): Promise<any> {
    try {

      console.log("userrrrrrrrrr ",user , "ccccccuserid     ",userid)
      const u: any = await User.update(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        //  address: user.address,
         // city : user.city,
          role:user.role
        
        },
        {
          where: { id: userid },
        }
      );

      if (!u) return null;
      console.log("uuuuuuuuuuu  repo ad  ",u)

      const updatedUser = await User.findByPk(userid);

      return updatedUser;
      
    } catch (error) {
      console.log(error);
    }
  }

  public async registerUser(user: any): Promise<any> {
    try {
      console.log("userrrrrrrrrrrr hereeeeeeeeeeeee   ", user);
      const createdUser = await User.create(user);
      return createdUser;
    } catch (error) {
      console.log(error);
    }
  }
  public async FindUserByEmail2(email: string): Promise<any> {
    try {
      return await User.findOne({ where: { email: email } });
    } catch (error) {}
  }

  public async IsExistUser(email: string): Promise<boolean> {
    try {
      let user: any = await User.findOne({ where: { email: email } });

      return user ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getUserById(id: number): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          id: id,
        },
      });

      return user; // null
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
