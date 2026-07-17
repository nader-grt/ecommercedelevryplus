import {
    Model,
    DataTypes,
    Sequelize,
    Optional,
  } from "sequelize";
  
  export interface IInventoryReservation {
    id?: number;
  
    orderId: number;
  
    inventoryId: number;
  
    warehouseId: number;
  
    variantId: number;
  
    companyId: number;
  
    quantity: number;
  
    status: "pending" | "confirmed" | "released";
  
    createdAt?: Date;
  
    updatedAt?: Date;
  }
  
  type InventoryReservationCreationAttributes =
    Optional<
      IInventoryReservation,
      "id" | "status" | "createdAt" | "updatedAt"
    >;
  
  export class InventoryReservation
    extends Model<
      IInventoryReservation,
      InventoryReservationCreationAttributes
    >
    implements IInventoryReservation
  {
    public id!: number;
  
    public orderId!: number;
  
    public inventoryId!: number;
  
    public warehouseId!: number;
  
    public variantId!: number;
  
    public companyId!: number;
  
    public quantity!: number;
  
    public status!: "pending" | "confirmed" | "released";
  
    public readonly createdAt!: Date;
  
    public readonly updatedAt!: Date;
  }
  
  export function InventoryReservationModel(
    sequelize: Sequelize
  ) {
    InventoryReservation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
  
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        inventoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        warehouseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        variantId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 1,
          },
        },
  
        status: {
          type: DataTypes.ENUM(
            "pending",
            "confirmed",
            "released"
          ),
          allowNull: false,
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        tableName: "InventoryReservations",
        timestamps: true,
      }
    );
  
    return InventoryReservation;
  }