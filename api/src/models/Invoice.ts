import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IInvoice {
    id?: number;
    orderId: number;
    invoiceNumber: string;
    issuedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }

export class Invoice extends Model<IInvoice> implements IInvoice {
  public id!: number;
  public orderId!: number;
  public invoiceNumber!: string;
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