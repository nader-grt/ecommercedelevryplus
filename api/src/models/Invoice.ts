import { DataTypes, Model, Sequelize } from "sequelize";

export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "CANCELLED";

export default interface IInvoice {
  id?: number;
  orderId: number;
  invoiceNumber: string;
  status: InvoiceStatus;
  issuedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice extends Model implements IInvoice {
  public id!: number;
  public orderId!: number;
  public invoiceNumber!: string;
  public status!: InvoiceStatus;
  public issuedAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export function InvoiceModel(sequelize: Sequelize) {
  Invoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      status: {
        type: DataTypes.ENUM(
          "DRAFT",
          "ISSUED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "DRAFT",
      },

      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "Invoices",
      timestamps: true,
    }
  );

  return Invoice;
}