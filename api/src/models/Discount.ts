import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IDiscount {
  id?: number;
  name: string;
  type: "PERCENT" | "FIXED";
  value: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Discount extends Model<IDiscount> implements IDiscount {
  public id!: number;
  public name!: string;
  public type!: "PERCENT" | "FIXED";
  public value!: number;
  public startDate!: Date;
  public endDate!: Date;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function DiscountModel(sequelize: Sequelize) {
  Discount.init(
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
        type: DataTypes.ENUM("PERCENT", "FIXED"),
        allowNull: false,
      },

      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "Discounts",
      timestamps: true,
    }
  );

  return Discount;
}