import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface IInventorie {
  id?: number;
  variantId: number;
  warehouseId: number;
  quantity?: number;
  reserved?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InventorieCreationAttributes extends Optional<IInventorie, 'id' | 'quantity' | 'reserved' | 'createdAt' | 'updatedAt'> {}

export class Inventorie extends Model<IInventorie, InventorieCreationAttributes> implements IInventorie {
  public id!: number;
  public variantId!: number;
  public warehouseId!: number;
  public quantity!: number;
  public reserved!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


}

export function InventorieModel(sequelize: Sequelize) {
  Inventorie.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Variants',
          key: 'id'
        }
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouses',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      reserved: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },
    {
      sequelize,
      tableName: "Inventories",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['variantId', 'warehouseId'] //
        }
      ]
    }
  );

  return Inventorie;
}