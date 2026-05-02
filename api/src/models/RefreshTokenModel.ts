import { Sequelize, DataTypes, Model } from "sequelize";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPPLIER = "SUPPLIER",
  DELIVERER ="DELIVERER",
  SECRTRIE ="SECRTRIE"
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









export default interface IRefreshToken {
  id?: number;
  userId:number;
  token:string ;
  revoked:boolean;
  expiresAt:Date;
  //city?: string;
  //address?: string;
}

/**
  userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      revoked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
 */

export class RefreshToken extends Model<IRefreshToken> implements IRefreshToken {
  public id!: number;
  public userId!: number;
  public token!: string;
  public revoked!: boolean;
  public expiresAt!: Date;
 
  //public city!: string;
 // public address!: string;
}

export function RefreshTokenModel(sequelize: Sequelize) {
    RefreshToken.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      token: { type: DataTypes.STRING, allowNull: false },
    //  revoked: { type: DataTypes.BOOLEAN, allowNull: false, unique: true },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
 
    },
    {
      sequelize,
      tableName: "RefreshTokens",
      timestamps: true,
    }
  );

  return RefreshToken;
}
