import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import sequelize from "../dbConfig/config";

/* =========================
   Interface
========================= */

export interface ICompany {
  id: number;
  name: string;
  type: "SHOP" | "WAREHOUSE" | "HYBRID";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   Create Interface (optional fields)
========================= */

export interface ICompanyCreation
  extends Optional<ICompany, "id" | "isActive" | "createdAt" | "updatedAt"> {}

/* =========================
   Model
========================= */

export class Company
  extends Model<ICompany, ICompanyCreation>
  implements ICompany
{
  public id!: number;
  public name!: string;
  public type!: "SHOP" | "WAREHOUSE" | "HYBRID";
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/* =========================
   Init Function
========================= */

export function CompanyModel(sequelize: Sequelize) {
  Company.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("SHOP", "WAREHOUSE", "HYBRID"),
        allowNull: false,
        defaultValue: "SHOP",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      // createdAt: {
      //   type: DataTypes.DATE,
      //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      // },

      // updatedAt: {
      //   type: DataTypes.DATE,
      //   defaultValue: Sequelize.literal(
      //     "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      //   ),
      // },
    },
    {
      sequelize,
      tableName: "Companies",
      timestamps: true,
    }
  );

  return Company;
}