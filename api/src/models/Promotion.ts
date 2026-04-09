import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IPromotion {
  id?: number;
  name: string;
  conditionType: "MIN_QTY" | "PRODUCT" | "WAREHOUSE";
  conditionValue: string;
  discountId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Promotion extends Model<IPromotion> implements IPromotion {
  public id!: number;
  public name!: string;
  public conditionType!: "MIN_QTY" | "PRODUCT" | "WAREHOUSE";
  public conditionValue!: string;
  public discountId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function PromotionModel(sequelize: Sequelize) {
  Promotion.init(
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

      conditionType: {
        type: DataTypes.ENUM("MIN_QTY", "PRODUCT", "WAREHOUSE"),
        allowNull: false,
      },

      conditionValue: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      discountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Discounts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "Promotions",
      timestamps: true,
    }
  );

  return Promotion;
}