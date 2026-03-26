import { DataTypes, Model, Sequelize, Optional } from "sequelize";


export interface IWarehouse {
  id: number;
  name: string;
  location: string;
  companyId: number;
  createdAt?: Date;
  updatedAt?: Date;
}


type WarehouseCreationAttributes = Optional<
  IWarehouse,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * Model
 */
export class Warehouse
  extends Model<IWarehouse, WarehouseCreationAttributes>
  implements IWarehouse
{
  public id!: number;
  public name!: string;
  public location!: string;
  public companyId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Init Model
 */
export function WarehouseModel(sequelize: Sequelize) {
  Warehouse.init(
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

      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // timestamps handled automatically
    //   createdAt: {
    //     type: DataTypes.DATE,
    //   },

    //   updatedAt: {
    //     type: DataTypes.DATE,
    //   },
    },
    {
      sequelize,
      tableName: "Warehouses",
      timestamps: true,
    }
  );

  return Warehouse;
}