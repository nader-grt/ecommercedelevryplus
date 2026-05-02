import { Sequelize, DataTypes, Model, Optional } from "sequelize";


export interface ICategory {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}



/**
 * Model
 */
export class Category
  extends Model<ICategory, any>
  implements ICategory
{
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

/**
 * Init Model
 */
export function CategoriesModel(sequelize: Sequelize) {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 255],
        },
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Categories",
      timestamps: true,

      paranoid: true, //  Soft delete enabled

      indexes: [
        {
          unique: true,
          fields: ["name"], 
        },
      ],
    }
  );

  return Category;
}