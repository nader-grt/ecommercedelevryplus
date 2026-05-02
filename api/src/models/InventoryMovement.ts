import { Model, Sequelize, DataTypes, Optional } from "sequelize";

// ==========================
// INTERFACE
// ==========================
export interface IInventoryMovement {
  id?: number;
  variantId: number;
  warehouseId: number;
  type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER";
  quantity: number;
  referenceId?: number;
  userId?: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==========================
// CREATION ATTRIBUTES
// ==========================
type InventoryMovementCreationAttributes = Optional<
  IInventoryMovement,
  "id" | "referenceId" | "userId" | "note" | "createdAt" | "updatedAt"
>;

// ==========================
// MODEL
// ==========================
export class InventoryMovement
  extends Model<IInventoryMovement, InventoryMovementCreationAttributes>
  implements IInventoryMovement
{
  public id!: number;
  public variantId!: number;
  public warehouseId!: number;
  public type!: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER";
  public quantity!: number;
  public referenceId?: number;
  public userId?: number;
  public note?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ==========================
// INIT
// ==========================
export function InventoryMovementModel(sequelize: Sequelize) {
  InventoryMovement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      warehouseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT", "TRANSFER"),
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      referenceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "InventoryMovements",
      timestamps: true,
    }
  );

  return InventoryMovement;
}