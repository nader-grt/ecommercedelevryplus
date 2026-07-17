import {
    Model,
    DataTypes,
    Sequelize,
    Optional,
  } from "sequelize";
  
  export interface IInventoryAudit {
    id?: number;
    variantId: number;
    warehouseId: number;
    systemQuantity: number;
    actualQuantity: number;
    difference: number;
    reason?: string;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  type InventoryAuditCreationAttributes = Optional<
    IInventoryAudit,
    "id" | "reason" | "userId" | "createdAt" | "updatedAt"
  >;
  
  export class InventoryAudit
    extends Model<IInventoryAudit, InventoryAuditCreationAttributes>
    implements IInventoryAudit
  {
    declare id: number;
    declare variantId: number;
    declare warehouseId: number;
    declare systemQuantity: number;
    declare actualQuantity: number;
    declare difference: number;
    declare reason?: string;
    declare userId?: number;
  
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
  }
  
  export function InventoryAuditModel(sequelize: Sequelize) {
    InventoryAudit.init(
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
  
        systemQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        actualQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        difference: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
  
        reason: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
  
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "InventoryAudits",
        timestamps: true,
      }
    );
  
    return InventoryAudit;
  }