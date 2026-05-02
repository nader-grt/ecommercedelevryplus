import {
  Model,
  DataTypes,
  Sequelize,
  Optional
} from "sequelize";

/* =========================
   Interface
========================= */

export interface ICompany {
  id: number;
  name: string;
  type: "SHOP" | "WAREHOUSE" | "HYBRID";

  ownerId?: number;

  trade_name?: string;
  tax_number?: string;
  registration_number?: string;

  status: "ACTIVE" | "SUSPENDED" | "DELETED";

  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   Creation Interface
========================= */

export interface ICompanyCreation
  extends Optional<
    ICompany,
    | "id"
    | "ownerId"
    | "trade_name"
    | "tax_number"
    | "registration_number"
    | "status"
    | "createdAt"
    | "updatedAt"
  > {}

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

  public ownerId?: number;

  public trade_name?: string;
  public tax_number?: string;
  public registration_number?: string;

  public status!: "ACTIVE" | "SUSPENDED" | "DELETED";

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

      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      trade_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      tax_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      registration_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "SUSPENDED", "DELETED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
    },
    {
      sequelize,
      tableName: "Companies",
      timestamps: true,
    }
  );

  return Company;
}