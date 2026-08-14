import { DataTypes, Model, Sequelize } from "sequelize";

export default interface IInvoiceItem {
  id?: number;
  invoiceId: number;
  productId: number;
  variantId?: number | null;
  productName: string;
  sku?: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InvoiceItem extends Model implements IInvoiceItem {
  public id!: number;

  public invoiceId!: number;
  public productId!: number;
  public variantId!: number | null;

  public productName!: string;
  public sku!: string | null;

  public quantity!: number;

  public unitPrice!: number;
  public discountAmount!: number;
  public taxAmount!: number;
  public totalAmount!: number;

  public createdAt!: Date;
  public updatedAt!: Date;
}

export function InvoiceItemModel(sequelize: Sequelize) {
  InvoiceItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      invoiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Invoices",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },

      variantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Variants",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      sku: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      unitPrice: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },

      discountAmount: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
        defaultValue: 0,
      },

      taxAmount: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
        defaultValue: 0,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "InvoiceItems",
      timestamps: true,
    }
  );

  return InvoiceItem;
}