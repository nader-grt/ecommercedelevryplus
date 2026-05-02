import { Sequelize, DataTypes, Model } from "sequelize";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPPLIER = "SUPPLIER",
  DELIVERER ="DELIVERER",
  SECRTRIE ="SECRTRIE",
  OWNER = "OWNER"
}


//  ERD   DIAGRAM ENTITY RELATIONSHIP 

//5  STEP 

/**
 * 


STEP 1  IDENTIFY ENTITY 

STEP 2  EXIST RELATIONSHIP  BETWEEN ENTITIES 

STEP 3  TYPE OF RELATIONSHIP one to one  or one to many  many to one  many to many  selef refrenceing 

STEP 4  CARDINALITY ORDINARITY  ( MIN AND MAX   (OPTIONAL  OR MANDATRY OR REQUIRED)

STEP 5 ATTRIBUTES  


 */









export default interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  role?: Role;
  companyId?:number | null
  //city?: string;
  //address?: string;
}

export class User extends Model<IUser> implements IUser {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public role!: Role;
  public companyId!:number | null
  //public city!: string;
 // public address!: string;
}

export function UserModel(sequelize: Sequelize) {
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM(...Object.values(Role)),
        allowNull: false,
       // defaultValue: Role.USER,
      },
      companyId: { type: DataTypes.INTEGER, allowNull: true },
     // address: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
}
